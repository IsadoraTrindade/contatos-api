export function validate(schema) {
    return (req, res, next) => {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.format() });
      }
      req.validated = parsed.data; // body validado
      next();
    };
  }
