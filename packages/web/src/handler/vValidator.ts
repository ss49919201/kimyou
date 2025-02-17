import { Hook } from "@hono/valibot-validator";
import { Env, ValidationTargets } from "hono";
import { HTTPException } from "hono/http-exception";
import * as v from "valibot";

export function vValidatorHook<
  T extends v.GenericSchema | v.GenericSchemaAsync,
  E extends Env,
  P extends string,
  Target extends keyof ValidationTargets = keyof ValidationTargets,
  O = {} // eslint-disable-line @typescript-eslint/no-empty-object-type
>(): Hook<T, E, P, Target, O> {
  return (
    result: v.SafeParseResult<T> & {
      target: Target;
    }
  ) => {
    if (!result.success) {
      const valiErr = new v.ValiError(result.issues);
      throw new HTTPException(400, {
        message: valiErr.message,
        cause: valiErr.cause,
      });
    }
  };
}
