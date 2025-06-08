const express = require("express");
const { authorization, validateRegister } = require("../Middleware/middle");
const { getAllUsers, getOneUser, userSignUp, userLogin, forgotPassword, resetUserPassword, deleteUser } = require("../Controllers/users");

const router = express.Router();

router.get("/all-users", authorization, getAllUsers);
router.get("/get-one-user", getOneUser);

router.post("/sign-up", validateRegister, userSignUp);
router.post("/login", userLogin);
router.post("/forgot-password", forgotPassword);

router.patch("/reset-password", resetUserPassword);

router.delete("/remove-user", deleteUser);

module.exports = router;

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDVjMmQwZTg2ZDlhOGQxZWQxMDcxZCIsImlhdCI6MTc0OTQwMjQ3OCwiZXhwIjoxNzQ5NDAzMzc4fQ.mEQW23ITv4WUlm3FkdjKjASHt7gEIxP2IYSJOkVEBmQ

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDVjNTVhZTg2ZDlhOGQxZWQxMDcyMyIsImlhdCI6MTc0OTQwMzAxMSwiZXhwIjoxNzQ5NDAzOTExfQ.WhJZg6skVkW4RCXZ1IX_ckgSIm6D_TIFmaPbL6dFYv4