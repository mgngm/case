import type { CookieSerializeOptions } from 'cookie';
import { serialize } from 'cookie';
import aws from 'src/aws-exports';
import { FEDERATION_COOKIE, SCOPES, RESPONSE_TYPE } from 'src/constants/auth';
import { DAY_MS } from 'src/constants/misc';
import { methodHandlers } from 'src/logic/server';
import { checkIdp } from 'src/logic/server/auth';
import type { LoginProviderResponseData } from 'src/types/api';

export default methodHandlers((builder) => {
  builder.post<LoginProviderResponseData | void>(async (req, res, { tokens }) => {
    //Use the provided email to check for a corresponding identityProvider
    const { domain } = req.body;
    const provider = await checkIdp(domain, tokens);

    //If we have an active provider, then we can set a federation cookie so we don't need to do this again
    if (provider) {
      //3 day expiry
      const expires = new Date(new Date().getTime() + DAY_MS * 3);
      const options: CookieSerializeOptions = { path: '/', expires, secure: true };
      res.setHeader(
        'Set-Cookie',
        serialize(
          FEDERATION_COOKIE,
          JSON.stringify({
            provider: domain,
          }),
          options
        )
      );

      //construct our sso redirect URL
      const ssoDomain = aws.oauth.domain;
      const clientId = aws.aws_user_pools_web_client_id;
      const scopes = SCOPES.join('+');

      // we want to redirect back to the landing page
      const redirectSignIn = `${req.headers.origin}/login/`;

      //Put it all together.
      const federatedSignInRedirect = `https://${ssoDomain}/oauth2/authorize?idp_identifier=${encodeURIComponent(
        domain
      )}&redirect_uri=${redirectSignIn}&response_type=${RESPONSE_TYPE}&client_id=${clientId}&scope=${scopes}`;

      //Fire it off back to the client (CORS issues if you try and do this on the API)
      return { ok: true, redirectUrl: federatedSignInRedirect };
    }
  });
});
