rest.post("/api/users/email/confirm", async (req, res, ctx) => {
    const { email, code } = await req.json();
  
    if (code !== "123456") {
      return res(
        ctx.status(400),
        ctx.json({
          status: 400,
          errorCode: "U-011",
          message: "코드 불일치",
        })
      );
    }
  
    return res(
      ctx.status(200),
      ctx.json({ success: true })
    );
  });
  