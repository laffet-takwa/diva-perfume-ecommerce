/* ==========================================================================
   DIVA STORE — Instagram
   The shop's discovery channel: new pours, batch photos and the odd reel. This
   module owns the handle so no screen ever hand-rolls the profile URL.
   ========================================================================== */

/** How the account is written for humans. */
export const INSTAGRAM_HANDLE = '@la_diva_store.202'

/** The profile, as linked from the footer, the mobile menu and the contact page. */
export const INSTAGRAM_LINK = 'https://www.instagram.com/la_diva_store.202/'

/* --------------------------------------------------------------------------
    The facts Instagram shows under "About this profile". They live here so the
    /about card can never drift from the handle the links already point at.
    -------------------------------------------------------------------------- */

/** Account creation date, as Instagram reports it. */
export const INSTAGRAM_JOINED = 'August 2023'

/** Account location, as shown on the profile. */
export const INSTAGRAM_LOCATION = 'Tunisia'

/** Names the account carried before, oldest first. Empty while there are none. */
export const INSTAGRAM_FORMER_HANDLES: readonly string[] = []