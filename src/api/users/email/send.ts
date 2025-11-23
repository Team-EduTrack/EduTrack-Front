rest.post("/api/users/email/send", async (req, res, ctx) => {
    const { email } = await req.json();
  
    // 이미 가입된 이메일 테스트
    if (email === "used@mail.com") {
      return res(
        ctx.status(400),
        ctx.json({
          status: 400,
          errorCode: "U-010",
          message: "이미 가입된 이메일입니다.",
        })
      );
    }
  
    // 정상
    return res(
      ctx.status(200),
      ctx.json({ success: true })
    );
  });
  