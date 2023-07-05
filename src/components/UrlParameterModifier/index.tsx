import { type FormEvent, useState } from "react";

import { updateUrlForSharing } from "../../utilities/update-url-for-sharing";
import { Button } from "../Button";
import { Card } from "../Card";
import { Heading } from "../Heading";
import { LabelledTextInput } from "../LabelledTextInput";
import { Spacer } from "../Spacer";

export const UrlParameterModifier = () => {
  const [urlToUpdate, setUrlToUpdate] = useState(
    "https://domain.tld/?existingSearchParameterKey=__EXISTING_SEARCH_PARAMETER_VALUE__&existingSearchParameterKeyWithoutValue#existingHashParameterKey=__EXISTING_HASH_PARAMETER_VALUE__&existingHashParameterKeyWithoutValue"
  );

  const [updatedUrl, setUpdatedUrl] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newUpdatedUrl = updateUrlForSharing({
      newParameters: {
        newSearchParameterKey: "__NEW_SEARCH_PARAMETER_VALUE__",
      },
      shouldApplyNewParametersToHashComponent: false,
      urlToUpdate,
    });

    setUpdatedUrl(newUpdatedUrl);
  };

  return (
    <Card>
      <article>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>
              <Heading headingLevel="h2">URL Parameter Modifier</Heading>

              <Spacer size="small" />

              <p>
                Enter a URL and click the "Update URL" button to modify the
                parameters of the given URL.
              </p>
            </legend>

            <Spacer />

            <LabelledTextInput
              isRequired
              label="URL"
              onValueChange={setUrlToUpdate}
              type="url"
              value={urlToUpdate}
            />

            <Spacer />

            <Button type="submit">Update URL</Button>

            <Spacer />

            <LabelledTextInput
              isReadonly
              label="Updated URL"
              type="url"
              value={updatedUrl}
            />
          </fieldset>
        </form>
      </article>
    </Card>
  );
};
