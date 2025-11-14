from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware

import hashlib, base64, re, time, secrets, bcrypt
from typing import Optional
import pandas as pd

salt = bcrypt.gensalt()

origins = [
    "http://localhost:5173",  # your React dev server
    "http://127.0.0.1:5173",  # sometimes React uses 127.0.0.1
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_users():
    df = pd.read_csv("users.csv")
    return df


def check_user_exists(email: str, password: str) -> str:
    df = load_users()
    user = df[(df["email"] == email) & (df["password"] == password)]
    if not user.empty:
        return user.iloc[0].to_dict()
    return None


def gen_uuid(length: int = 8, salt: str = "yourSaltHere") -> str:
    """
    Python equivalent of the PHP gen_uuid($len=8). https://stackoverflow.com/questions/307486/short-unique-id-in-php

    - length: desired length (clamped to [4, 128]).
    - salt: string salt used in MD5 input.
    """
    length = max(4, min(128, int(length)))

    # Create a unique token similar to PHP uniqid(..., true)
    uniq = f"{time.time_ns()}-{secrets.token_hex(8)}"

    # MD5 of salt + uniq
    h = hashlib.md5((salt + uniq).encode("utf-8")).hexdigest()

    # convert hex to bytes, then base64 encode
    packed = bytes.fromhex(h)
    tmp = base64.b64encode(packed).decode("ascii")

    # strip non-alphanumeric characters (UTF-8 safe)
    uid = re.sub(r"[^A-Za-z0-9]", "", tmp)

    # If too short, append more by recursive generation (chunks of 22 to match original)
    while len(uid) < length:
        uid += gen_uuid(22, salt)

    return uid[:length]


# Routes:
# Login route
@app.post("/login")
def login(data: dict, response: Response):
    email = data.get("email")
    password = data.get("password")

    # user = check_user_exists(email, password)
    df = load_users()
    user = df[(df["email"] == email)]

    stored_password = user["password"].iloc[0] if not user.empty else None
    if stored_password is not None:
        try:
            if not bcrypt.checkpw(
                password.encode("utf-8"), stored_password.encode("utf-8")
            ):
                return {"status": "error", "message": "Invalid password"}
        except:
            return {"status": "error", "message": "Invalid password"}

    if user.empty:
        user = None
    else:
        user = user.iloc[0].to_dict()

    if user is None:
        # raise HTTPException(status_code=401, detail="Invalid email or password")
        return {"status": "error", "message": "Invalid email or password"}

    # Set a simple session cookie
    response.set_cookie(
        key="session",
        value=user["uuid"],
        httponly=True,
        max_age=3600,
    )

    return {"status": "ok", "message": "Logged in!"}


# Signup route
@app.post("/signup")
def signup(data: dict):
    email = data.get("email")
    password = data.get("password")
    confirmpass = data.get("confirmpass")
    fname = data.get("fname")
    lname = data.get("lname")

    if password != confirmpass:
        # raise HTTPException(status_code=400, detail="Passwords do not match")
        return {"status": "error", "message": "Passwords do not match"}

    df = load_users()

    if not df[df["email"] == email].empty:
        # raise HTTPException(status_code=400, detail="Email already exists")
        return {"status": "error", "message": "Email already exists"}

    encrypted_password = bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

    new_user = {
        "uuid": gen_uuid(),
        "email": email,
        "password": encrypted_password,
        "fname": fname,
        "lname": lname,
    }

    new_user_df = pd.DataFrame([new_user])

    df = pd.concat([df, new_user_df], ignore_index=True)
    df.to_csv("users.csv", index=False)

    return {"status": "ok", "message": "User registered successfully"}


@app.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="session")
    return {"status": "ok", "message": "Logged out!"}


@app.get("/me")
def me(session: str | None = None):
    # This gets the cookie automatically
    if not session:
        return {"logged_in": False}

    return {"logged_in": True, "uuid": session}
