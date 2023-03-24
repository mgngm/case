type PollProps<Result> = {
  fn: (debug?: boolean) => Promise<Result | null>;
  validate: (parse: Result, debug?: boolean) => boolean;
  interval: number;
  maxAttempts?: number;
  status?: string; //used for logging.
  debug?: boolean;
};

/**
 *
 * @param fn - Function to run on the poll (for report parse stuff usually a lazy query.)
 * @param validate - Validation fn for the result - for report poll it's checking the result of the parse is now SUCCESS
 * @param interval - Self explanatory
 * @param maxAttempts - max attempts to try before erorring - setting as -1 disables.
 * @returns
 */
export const validatedPoll = async <Result>({
  fn,
  validate,
  interval,
  maxAttempts = -1,
  status,
  debug,
}: PollProps<Result>) => {
  let attempts = 0;

  if (debug) {
    console.log('++ Poll started!! ++', status);
  }

  const executePoll: ConstructorParameters<typeof Promise<Result>>[0] = async (resolve, reject) => {
    let result;
    try {
      result = await fn(debug);
      attempts++;
    } catch (e) {
      reject(e);
    }

    if (result) {
      let validated;
      try {
        validated = validate(result);

        if (validated) {
          return resolve(result);
        } else if (maxAttempts && attempts === maxAttempts) {
          return reject(new Error('Exceeded max attempts'));
        } else {
          setTimeout(executePoll, interval, resolve, reject);
        }
      } catch (err) {
        reject(err);
      }
    } else if (maxAttempts && attempts === maxAttempts) {
      return reject(new Error('Exceeded max attempts'));
    } else {
      setTimeout(executePoll, interval, resolve, reject);
    }
  };

  return new Promise<Result>(executePoll);
};
