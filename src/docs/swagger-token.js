(function () {
  let lastAccessToken = "";

  function removeOldHelper() {
    const oldHelper = document.querySelector(".swagger-token-helper");
    if (oldHelper) oldHelper.remove();
  }

  function showTokenHelper({ title, message, isError = false }) {
    removeOldHelper();

    const helper = document.createElement("div");
    helper.className = `swagger-token-helper${isError ? " error" : ""}`;

    const titleElement = document.createElement("div");
    titleElement.className = "swagger-token-helper-title";
    titleElement.textContent = title;

    const messageElement = document.createElement("div");
    messageElement.className = "swagger-token-helper-message";
    messageElement.textContent = message;

    const actions = document.createElement("div");
    actions.className = "swagger-token-helper-actions";

    if (lastAccessToken) {
      const copyButton = document.createElement("button");
      copyButton.className = "swagger-token-copy-button";
      copyButton.textContent = "Copy token again";

      copyButton.addEventListener("click", async () => {
        const copied = await copyToken(lastAccessToken);

        showTokenHelper({
          title: copied ? "Token copied" : "Copy failed",
          message: copied
            ? "Only the access token was copied."
            : "Browser blocked clipboard access. Please copy the token from the login response manually.",
          isError: !copied,
        });
      });

      actions.appendChild(copyButton);
    }

    const closeButton = document.createElement("button");
    closeButton.className = "swagger-token-close-button";
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", removeOldHelper);

    actions.appendChild(closeButton);

    helper.appendChild(titleElement);
    helper.appendChild(messageElement);
    helper.appendChild(actions);

    document.body.appendChild(helper);
  }

  async function copyToken(token) {
    if (!token) return false;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(token);
        return true;
      } catch {
        return false;
      }
    }

    return false;
  }

  function applyTokenToSwagger(token) {
    if (!window.ui || !window.ui.preauthorizeApiKey) {
      return false;
    }

    try {
      window.ui.preauthorizeApiKey("bearerAuth", token);
      return true;
    } catch {
      return false;
    }
  }

  const originalFetch = window.fetch;

  window.fetch = async function () {
    const response = await originalFetch.apply(this, arguments);

    try {
      const request = arguments[0];
      const options = arguments[1] || {};

      const requestUrl =
        typeof request === "string"
          ? request
          : request && request.url
            ? request.url
            : "";

      const method = options.method || (request && request.method) || "GET";

      const isLoginRequest =
        requestUrl.includes("/api/auth/login") &&
        method.toUpperCase() === "POST";

      if (!isLoginRequest) {
        return response;
      }

      const clonedResponse = response.clone();
      const data = await clonedResponse.json();

      const token = data.accessToken;

      if (!token) {
        showTokenHelper({
          title: "No token found",
          message: "Login response did not contain accessToken.",
          isError: true,
        });

        return response;
      }

      lastAccessToken = token;

      const copied = await copyToken(token);
      const applied = applyTokenToSwagger(token);

      if (copied && applied) {
        showTokenHelper({
          title: "Token copied and authorized",
          message:
            "Only the access token was copied. It was also applied to Swagger Authorize automatically.",
        });

        return response;
      }

      if (!copied && applied) {
        showTokenHelper({
          title: "Token authorized",
          message:
            "Swagger Authorize was updated automatically, but the browser blocked clipboard copy.",
        });

        return response;
      }

      if (copied && !applied) {
        showTokenHelper({
          title: "Token copied",
          message:
            "Only the access token was copied. Please paste it into Swagger Authorize.",
        });

        return response;
      }

      showTokenHelper({
        title: "Token received",
        message:
          "Login worked, but automatic copy and authorization were blocked. Copy accessToken from the response manually.",
        isError: true,
      });
    } catch {
      return response;
    }

    return response;
  };
})();