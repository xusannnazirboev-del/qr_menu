import { BadRequestException } from "../exceptions/bad-request.exception.js"


export const ValidationMiddleware = (schema,target = "body") => {
  const ALLOWED_TARGETS = ["body", "query","params"]
  if(!ALLOWED_TARGETS.includes(target)){
    throw new Error("Validation target invalid")
  }
  return (req,res,next) => {
    try {
      const {error,value} = schema.validate(req[target])
      if (error) {
          let errorMsg = error.details?.map((err) => err.message).join("| ");
          const isAjax = req.headers.accept?.includes("application/json");

          if (!isAjax) {
              const referer = req.headers.referer || "/login";
              const back = referer.split("?")[0];
              return res.redirect(
                  `${back}?error=${encodeURIComponent(errorMsg)}`,
              );
          }
          throw new BadRequestException(errorMsg);
      }
      req[target] = value
      next()
    } catch (error) {
      next(error)
    }
  }
}