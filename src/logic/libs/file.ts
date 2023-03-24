/**
 * Checks whether given file is acceptable based on accept string
 * @param file File to be checked
 * @param accept Comma separated list of acceptable file types
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers
 * @returns whether file is accepted
 */

export const validateFileType = (file: File, accept: string) => {
  const acceptTypes = accept.replace(/\s/, '').split(',');
  return acceptTypes.some((acceptType) => {
    if (acceptType.startsWith('.')) {
      return file.name.endsWith(acceptType);
    } else {
      const acceptTypeRegex = new RegExp(acceptType.replace('*', '.*'));
      return acceptTypeRegex.test(file.type);
    }
  });
};
