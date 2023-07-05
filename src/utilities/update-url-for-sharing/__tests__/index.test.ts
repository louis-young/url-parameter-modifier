import { describe, it, expect } from "vitest";
import { updateUrlForSharing } from "..";

/**
 * Talking points:
 *
 * 1. Compounding tests and diminishing returns.
 * 2. Parametrised test cases (`jest.each`).
 * 3. Nesting and test dependency co-location.
 * 4. Hardcoded literal strings.
 */

describe("updateUrlForSharing", () => {
  it("decodes existing parameter keys and values and encodes new parameter keys and values", () => {
    const urlToUpdate =
      "https://domain.tld/#%3B%2F%3F%3A%40%26%3D%2B%2C%24%20=%20%24%2C%2B%3D%26%40%3A%3F%2F%3B";

    const newParameters = {
      " $,+=&@:?/;": ";/?:@&=+,$ ", // https://www.ietf.org/rfc/rfc2396.txt (2.2. Reserved Characters).
    };

    const shouldApplyNewParametersToHashComponent = false;

    const updatedUrlForSharing = updateUrlForSharing({
      urlToUpdate,
      newParameters,
      shouldApplyNewParametersToHashComponent,
    });

    expect(updatedUrlForSharing).toEqual(
      "https://domain.tld/?%20%24%2C%2B%3D%26%40%3A%3F%2F%3B=%3B%2F%3F%3A%40%26%3D%2B%2C%24%20#%3B%2F%3F%3A%40%26%3D%2B%2C%24%20=%20%24%2C%2B%3D%26%40%3A%3F%2F%3B"
    );
  });

  describe("when no hash or search parameters exist", () => {
    it("adds new hash parameters", () => {
      const urlToUpdate = "https://domain.tld/";

      const newParameters = {
        newHashParameterKey: "__NEW_HASH_PARAMETER_VALUE__",
      };

      const shouldApplyNewParametersToHashComponent = true;

      const updatedUrlForSharing = updateUrlForSharing({
        urlToUpdate,
        newParameters,
        shouldApplyNewParametersToHashComponent,
      });

      expect(updatedUrlForSharing).toEqual(
        "https://domain.tld/#newHashParameterKey=__NEW_HASH_PARAMETER_VALUE__"
      );
    });

    it("adds new search parameters", () => {
      const urlToUpdate = "https://domain.tld/";

      const newParameters = {
        newSearchParameterKey: "__NEW_SEARCH_PARAMETER_VALUE__",
      };

      const shouldApplyNewParametersToHashComponent = false;

      const updatedUrlForSharing = updateUrlForSharing({
        urlToUpdate,
        newParameters,
        shouldApplyNewParametersToHashComponent,
      });

      expect(updatedUrlForSharing).toEqual(
        "https://domain.tld/?newSearchParameterKey=__NEW_SEARCH_PARAMETER_VALUE__"
      );
    });
  });

  describe("when only hash parameters exist", () => {
    it("adds new hash parameters and preserves existing hash parameters", () => {
      const urlToUpdate =
        "https://domain.tld/#existingHashParameterKey=__EXISTING_HASH_PARAMETER_VALUE__&existingHashParameterWithoutValueKey";

      const newParameters = {
        newHashParameterKey: "__NEW_HASH_PARAMETER_VALUE__",
        newHashParameterWithoutValueKey: undefined,
      };

      const shouldApplyNewParametersToHashComponent = true;

      const updatedUrlForSharing = updateUrlForSharing({
        urlToUpdate,
        newParameters,
        shouldApplyNewParametersToHashComponent,
      });

      expect(updatedUrlForSharing).toEqual(
        "https://domain.tld/#existingHashParameterKey=__EXISTING_HASH_PARAMETER_VALUE__&existingHashParameterWithoutValueKey&newHashParameterKey=__NEW_HASH_PARAMETER_VALUE__&newHashParameterWithoutValueKey"
      );
    });

    it("adds new search parameters and preserves existing hash parameters", () => {
      const urlToUpdate =
        "https://domain.tld/#existingHashParameterKey=__EXISTING_HASH_PARAMETER_VALUE__&existingHashParameterWithoutValueKey";

      const newParameters = {
        newSearchParameterKey: "__NEW_SEARCH_PARAMETER_VALUE__",
        newSearchParameterWithoutValueKey: undefined,
      };

      const shouldApplyNewParametersToHashComponent = false;

      const updatedUrlForSharing = updateUrlForSharing({
        urlToUpdate,
        newParameters,
        shouldApplyNewParametersToHashComponent,
      });

      expect(updatedUrlForSharing).toEqual(
        "https://domain.tld/?newSearchParameterKey=__NEW_SEARCH_PARAMETER_VALUE__&newSearchParameterWithoutValueKey#existingHashParameterKey=__EXISTING_HASH_PARAMETER_VALUE__&existingHashParameterWithoutValueKey"
      );
    });

    it("replaces newer existing hash parameters and preserves other existing hash parameters", () => {
      const urlToUpdate =
        "https://domain.tld/#existingHashParameterKey=__EXISTING_HASH_PARAMETER_VALUE__&existingHashParameterToReplaceKey=__EXISTING_HASH_PARAMETER_TO_REPLACE_VALUE__&existingHashParameterWithoutValueToReplaceKey";

      const newParameters = {
        existingHashParameterToReplaceKey:
          "__NEW_EXISTING_HASH_PARAMETER_TO_REPLACE_VALUE__",
        existingHashParameterWithoutValueToReplaceKey:
          "__NEW_EXISTING_HASH_PARAMETER_WITHOUT_VALUE_TO_REPLACE_VALUE__",
      };

      const shouldApplyNewParametersToHashComponent = true;

      const updatedUrlForSharing = updateUrlForSharing({
        urlToUpdate,
        newParameters,
        shouldApplyNewParametersToHashComponent,
      });

      expect(updatedUrlForSharing).toEqual(
        "https://domain.tld/#existingHashParameterKey=__EXISTING_HASH_PARAMETER_VALUE__&existingHashParameterToReplaceKey=__NEW_EXISTING_HASH_PARAMETER_TO_REPLACE_VALUE__&existingHashParameterWithoutValueToReplaceKey=__NEW_EXISTING_HASH_PARAMETER_WITHOUT_VALUE_TO_REPLACE_VALUE__"
      );
    });
  });

  describe("when only search parameters exist", () => {
    it("adds new hash parameters and preserves existing search parameters", () => {
      const urlToUpdate =
        "https://domain.tld/?existingSearchParameterKey=__EXISTING_SEARCH_PARAMETER_VALUE__&existingSearchParameterWithoutValueKey";

      const newParameters = {
        newHashParameterKey: "__NEW_HASH_PARAMETER_VALUE__",
        newHashParameterWithoutValueKey: undefined,
      };

      const shouldApplyNewParametersToHashComponent = true;

      const updatedUrlForSharing = updateUrlForSharing({
        urlToUpdate,
        newParameters,
        shouldApplyNewParametersToHashComponent,
      });

      expect(updatedUrlForSharing).toEqual(
        "https://domain.tld/?existingSearchParameterKey=__EXISTING_SEARCH_PARAMETER_VALUE__&existingSearchParameterWithoutValueKey#newHashParameterKey=__NEW_HASH_PARAMETER_VALUE__&newHashParameterWithoutValueKey"
      );
    });

    it("adds new search parameters and preserves existing search parameters", () => {
      const urlToUpdate =
        "https://domain.tld/?existingSearchParameterKey=__EXISTING_SEARCH_PARAMETER_VALUE__&existingSearchParameterWithoutValueKey";

      const newParameters = {
        newSearchParameterKey: "__NEW_SEARCH_PARAMETER_VALUE__",
        newSearchParameterWithoutValueKey: undefined,
      };

      const shouldApplyNewParametersToHashComponent = false;

      const updatedUrlForSharing = updateUrlForSharing({
        urlToUpdate,
        newParameters,
        shouldApplyNewParametersToHashComponent,
      });

      expect(updatedUrlForSharing).toEqual(
        "https://domain.tld/?existingSearchParameterKey=__EXISTING_SEARCH_PARAMETER_VALUE__&existingSearchParameterWithoutValueKey&newSearchParameterKey=__NEW_SEARCH_PARAMETER_VALUE__&newSearchParameterWithoutValueKey"
      );
    });

    it("replaces newer existing search parameters and preserves other existing search parameters", () => {
      const urlToUpdate =
        "https://domain.tld/?existingSearchParameterKey=__EXISTING_SEARCH_PARAMETER_VALUE__&existingSearchParameterToReplaceKey=__EXISTING_SEARCH_PARAMETER_TO_REPLACE_VALUE__&existingSearchParameterWithoutValueToReplaceKey";

      const newParameters = {
        existingSearchParameterToReplaceKey:
          "__NEW_EXISTING_SEARCH_PARAMETER_TO_REPLACE_VALUE__",
        existingSearchParameterWithoutValueToReplaceKey:
          "__NEW_EXISTING_SEARCH_PARAMETER_WITHOUT_VALUE_TO_REPLACE_VALUE__",
      };

      const shouldApplyNewParametersToHashComponent = false;

      const updatedUrlForSharing = updateUrlForSharing({
        urlToUpdate,
        newParameters,
        shouldApplyNewParametersToHashComponent,
      });

      expect(updatedUrlForSharing).toEqual(
        "https://domain.tld/?existingSearchParameterKey=__EXISTING_SEARCH_PARAMETER_VALUE__&existingSearchParameterToReplaceKey=__NEW_EXISTING_SEARCH_PARAMETER_TO_REPLACE_VALUE__&existingSearchParameterWithoutValueToReplaceKey=__NEW_EXISTING_SEARCH_PARAMETER_WITHOUT_VALUE_TO_REPLACE_VALUE__"
      );
    });

    describe("when hash and search parameters exist", () => {
      it("adds new hash parameters and preserves existing hash and search parameters", () => {
        const urlToUpdate =
          "https://domain.tld/?existingSearchParameterKey=__EXISTING_SEARCH_PARAMETER_VALUE__#existingHashParameterKey=__EXISTING_HASH_PARAMETER_VALUE__";

        const newParameters = {
          newHashParameterKey: "__NEW_HASH_PARAMETER_VALUE__",
        };

        const shouldApplyNewParametersToHashComponent = true;

        const updatedUrlForSharing = updateUrlForSharing({
          urlToUpdate,
          newParameters,
          shouldApplyNewParametersToHashComponent,
        });

        expect(updatedUrlForSharing).toEqual(
          "https://domain.tld/?existingSearchParameterKey=__EXISTING_SEARCH_PARAMETER_VALUE__#existingHashParameterKey=__EXISTING_HASH_PARAMETER_VALUE__&newHashParameterKey=__NEW_HASH_PARAMETER_VALUE__"
        );
      });

      it("adds new search parameters and preserves existing hash and search parameters", () => {
        const urlToUpdate =
          "https://domain.tld/?existingSearchParameterKey=__EXISTING_SEARCH_PARAMETER_VALUE__#existingHashParameterKey=__EXISTING_HASH_PARAMETER_VALUE__";

        const newParameters = {
          newSearchParameterKey: "__NEW_SEARCH_PARAMETER_VALUE__",
        };

        const shouldApplyNewParametersToHashComponent = false;

        const updatedUrlForSharing = updateUrlForSharing({
          urlToUpdate,
          newParameters,
          shouldApplyNewParametersToHashComponent,
        });

        expect(updatedUrlForSharing).toEqual(
          "https://domain.tld/?existingSearchParameterKey=__EXISTING_SEARCH_PARAMETER_VALUE__&newSearchParameterKey=__NEW_SEARCH_PARAMETER_VALUE__#existingHashParameterKey=__EXISTING_HASH_PARAMETER_VALUE__"
        );
      });

      it("replaces newer existing hash parameters and preserves other existing hash and search parameters", () => {
        const urlToUpdate =
          "https://domain.tld/?existingSearchParameterKey=__EXISTING_SEARCH_PARAMETER_VALUE__#existingHashParameterKey=__EXISTING_HASH_PARAMETER_VALUE__&existingHashParameterToReplaceKey=__EXISTING_HASH_PARAMETER_TO_REPLACE_VALUE__";

        const newParameters = {
          existingHashParameterToReplaceKey:
            "__NEW_EXISTING_HASH_PARAMETER_TO_REPLACE_VALUE__",
        };

        const shouldApplyNewParametersToHashComponent = true;

        const updatedUrlForSharing = updateUrlForSharing({
          urlToUpdate,
          newParameters,
          shouldApplyNewParametersToHashComponent,
        });

        expect(updatedUrlForSharing).toEqual(
          "https://domain.tld/?existingSearchParameterKey=__EXISTING_SEARCH_PARAMETER_VALUE__#existingHashParameterKey=__EXISTING_HASH_PARAMETER_VALUE__&existingHashParameterToReplaceKey=__NEW_EXISTING_HASH_PARAMETER_TO_REPLACE_VALUE__"
        );
      });

      it("replaces newer existing search parameters and preserves other existing hash and search parameters", () => {
        const urlToUpdate =
          "https://domain.tld/?existingSearchParameterKey=__EXISTING_SEARCH_PARAMETER_VALUE__&existingSearchParameterToReplaceKey=__EXISTING_SEARCH_PARAMETER_TO_REPLACE_VALUE__#existingHashParameterKey=__EXISTING_HASH_PARAMETER_VALUE__";

        const newParameters = {
          existingSearchParameterToReplaceKey:
            "__NEW_EXISTING_SEARCH_PARAMETER_TO_REPLACE_VALUE__",
        };

        const shouldApplyNewParametersToHashComponent = false;

        const updatedUrlForSharing = updateUrlForSharing({
          urlToUpdate,
          newParameters,
          shouldApplyNewParametersToHashComponent,
        });

        expect(updatedUrlForSharing).toEqual(
          "https://domain.tld/?existingSearchParameterKey=__EXISTING_SEARCH_PARAMETER_VALUE__&existingSearchParameterToReplaceKey=__NEW_EXISTING_SEARCH_PARAMETER_TO_REPLACE_VALUE__#existingHashParameterKey=__EXISTING_HASH_PARAMETER_VALUE__"
        );
      });

      it("removes conflicting search parameters when adding hash parameters and preserves other existing hash and search parameters", () => {
        const urlToUpdate =
          "https://domain.tld/?existingSearchParameterKey=__EXISTING_SEARCH_PARAMETER_VALUE__&conflictingParameterKey=__CONFLICTING_PARAMETER__VALUE__#existingHashParameterKey=__EXISTING_HASH_PARAMETER_VALUE__";

        const newParameters = {
          conflictingParameterKey: "__NEW_CONFLICTING_PARAMETER__VALUE__",
        };

        const shouldApplyNewParametersToHashComponent = true;

        const updatedUrlForSharing = updateUrlForSharing({
          urlToUpdate,
          newParameters,
          shouldApplyNewParametersToHashComponent,
        });

        expect(updatedUrlForSharing).toEqual(
          "https://domain.tld/?existingSearchParameterKey=__EXISTING_SEARCH_PARAMETER_VALUE__#existingHashParameterKey=__EXISTING_HASH_PARAMETER_VALUE__&conflictingParameterKey=__NEW_CONFLICTING_PARAMETER__VALUE__"
        );
      });

      it("removes conflicting hash parameters when adding search parameters and preserves other existing hash and search parameters", () => {
        const urlToUpdate =
          "https://domain.tld/?existingSearchParameterKey=__EXISTING_SEARCH_PARAMETER_VALUE__#existingHashParameterKey=__EXISTING_HASH_PARAMETER_VALUE__&conflictingParameterKey=__CONFLICTING_PARAMETER__VALUE__";

        const newParameters = {
          conflictingParameterKey: "__NEW_CONFLICTING_PARAMETER__VALUE__",
        };

        const shouldApplyNewParametersToHashComponent = false;

        const updatedUrlForSharing = updateUrlForSharing({
          urlToUpdate,
          newParameters,
          shouldApplyNewParametersToHashComponent,
        });

        expect(updatedUrlForSharing).toEqual(
          "https://domain.tld/?existingSearchParameterKey=__EXISTING_SEARCH_PARAMETER_VALUE__&conflictingParameterKey=__NEW_CONFLICTING_PARAMETER__VALUE__#existingHashParameterKey=__EXISTING_HASH_PARAMETER_VALUE__"
        );
      });
    });
  });
});
