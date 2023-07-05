/**
 * Talking points:
 *
 * 1. Utilisation (or lack thereof) of the `URLSearchParams` API, and why it's awkward to leverage effectively given the requirements.
 * 2. Slicing and splitting the component string and constructing parameter records "manually". Constrained by the hash component requirement.
 * 3. Constructing parameter strings "manually". Constrained by the keys without values requirement.
 * 4. Performing updates immutably where mutation is safe (within the context of an `Array.reduce` reducer function).
 * 5. Identifying and leveraging mutation where it's safe to do so (within the context of a pure/deterministic function).
 * 6. When and where object function interfaces are used.
 * 7. Comments.
 */

type ParameterKey = string;
type ParameterValue = string | undefined;

type ParameterRecord = Record<ParameterKey, ParameterValue>;

const PARAMETER_SEPARATOR_CHARACTER = "&";
const PARAMETER_KEY_VALUE_SEPARATOR_CHARACTER = "=";

/**
 * Removes the URL component type character (`?` or `#` for search and hash components respectively) from a given parameter string.
 *
 * Returns the modified string with the URL component type character removed.
 */

const removeUrlComponentTypeCharacterFromParameterString = (
  parameterString: string
) => {
  return parameterString.slice(1);
};

/**
 * Constructs a parameter record from a parameter string.
 *
 * Returns the constructed parameter record.
 */

const constructParametersFromString = (parameterString: string) => {
  if (parameterString === "") {
    return {};
  }

  const parameterArray = parameterString.split(PARAMETER_SEPARATOR_CHARACTER);

  return parameterArray.reduce<ParameterRecord>(
    (parametersAccumulator, parameter) => {
      const hasParameterValue = parameter.includes(
        PARAMETER_KEY_VALUE_SEPARATOR_CHARACTER
      );

      if (!hasParameterValue) {
        return {
          ...parametersAccumulator,
          [parameter]: undefined,
        };
      }

      const [parameterKey, parameterValue] = parameter.split(
        PARAMETER_KEY_VALUE_SEPARATOR_CHARACTER
      );

      const decodedParameterKey = decodeURIComponent(parameterKey);
      const decodedParameterValue = decodeURIComponent(parameterValue);

      return {
        ...parametersAccumulator,
        [decodedParameterKey]: decodedParameterValue,
      };
    },
    {}
  );
};

/**
 * Constructs a parameter string from a parameter record.
 *
 * Returns the constructed parameter string.
 */

const constructParameterStringFromParameters = (
  parameters: ParameterRecord
) => {
  const parameterArray = Object.entries(parameters).map(
    ([parameterKey, parameterValue]) => {
      const hasParameterValue = parameterValue !== undefined;

      const encodedParameterKey = encodeURIComponent(parameterKey);

      if (!hasParameterValue) {
        return encodedParameterKey;
      }

      const encodedParameterValue = encodeURIComponent(parameterValue);

      return [encodedParameterKey, encodedParameterValue].join(
        PARAMETER_KEY_VALUE_SEPARATOR_CHARACTER
      );
    },
    []
  );

  return parameterArray.join(PARAMETER_SEPARATOR_CHARACTER);
};

/**
 * Updates URL search or hash parameters, removing conflicting search/hash parameters where necessary.
 *
 * Returns the updated search parameter and hash parameter records.
 */

interface UpdateUrlParametersParameters {
  newParameters: ParameterRecord;
  shouldApplyNewParametersToHashComponent: boolean;
  hashParameters: ParameterRecord;
  searchParameters: ParameterRecord;
}

const updateUrlParameters = ({
  newParameters,
  shouldApplyNewParametersToHashComponent,
  hashParameters,
  searchParameters,
}: UpdateUrlParametersParameters) => {
  const targetParameters = shouldApplyNewParametersToHashComponent
    ? hashParameters
    : searchParameters;

  const opposingParameters = shouldApplyNewParametersToHashComponent
    ? searchParameters
    : hashParameters;

  const opposingParametersWithoutConflictingKeys = Object.fromEntries(
    Object.entries(opposingParameters).filter(([opposingParameterKey]) => {
      const isConflictingParameterKey = opposingParameterKey in newParameters;

      return !isConflictingParameterKey;
    })
  );

  const updatedTargetParameters = Object.entries(newParameters).reduce(
    (
      updatedTargetParametersAccumulator,
      [newParameterKey, newParameterValue]
    ) => {
      return {
        ...updatedTargetParametersAccumulator,
        [newParameterKey]: newParameterValue,
      };
    },
    targetParameters
  );

  return {
    updatedSearchParameters: shouldApplyNewParametersToHashComponent
      ? opposingParametersWithoutConflictingKeys
      : updatedTargetParameters,
    updatedHashParameters: shouldApplyNewParametersToHashComponent
      ? updatedTargetParameters
      : opposingParametersWithoutConflictingKeys,
  };
};

/**
 * Updates the given URL, changing its search or hash parameters, and removing conflicting search/hash parameters where necessary.
 *
 * Returns the updated URL for sharing.
 */

interface UpdateUrlForSharingParameters {
  urlToUpdate: string;
  newParameters: ParameterRecord;
  shouldApplyNewParametersToHashComponent: boolean;
}

export const updateUrlForSharing = ({
  urlToUpdate,
  newParameters,
  shouldApplyNewParametersToHashComponent,
}: UpdateUrlForSharingParameters) => {
  const url = new URL(urlToUpdate);

  const hashParameters = constructParametersFromString(
    removeUrlComponentTypeCharacterFromParameterString(url.hash)
  );

  const searchParameters = constructParametersFromString(
    removeUrlComponentTypeCharacterFromParameterString(url.search)
  );

  const { updatedHashParameters, updatedSearchParameters } =
    updateUrlParameters({
      newParameters,
      shouldApplyNewParametersToHashComponent,
      hashParameters,
      searchParameters,
    });

  const updatedHashParameterString = constructParameterStringFromParameters(
    updatedHashParameters
  );

  const updatedSearchParameterString = constructParameterStringFromParameters(
    updatedSearchParameters
  );

  url.hash = updatedHashParameterString;
  url.search = updatedSearchParameterString;

  return url.href;
};
