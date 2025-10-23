// ~/plugins/theme.ts

export default defineNuxtPlugin(() => {

  // 1. Initialize store from cookie (server + client)
  const themeCookie = useCookie<"light" | "dark">("theme", {
    default: () => "dark",
    maxAge: 60 * 60 * 24 * 365,
  });

  // 2. Always merge your htmlAttrs!
  useHead(() => ({
    htmlAttrs: {
      class: themeCookie.value === "dark" ? "dark" : "",
    },
  }));


});
