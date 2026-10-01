# OASIS 2021 edition refinement

The user-approved scope is to preserve the original museum artwork, typography, room layout and animations while removing added visible portfolio/archive/demo labels and simulated registration. The entrance registration link remains commented out exactly as in the original edition. A direct visit to registration.html displays the original wall art with a small accessible notice reading “Registration is closed for this edition”.

Use a native dialog with keyboard dismissal, a labelled close control and an entrance link. Remove the form, sample identities and local preview logic. Maintain the original desktop and mobile painting assets; use picture sources so each device downloads its own art.

Optimize without changing the art: transcode SVG-embedded PNG images to lossless WebP and verify decoded pixels, package the original fonts as WOFF2, build only referenced resources, fingerprint deployable assets, revalidate HTML, and preload or prefetch only likely navigation resources. Keep loading immediate. Verify the locked installation, dependency audit, output references, closed-registration behavior, original artwork equivalence and build size. Parent owns desktop/mobile browser checks and publication.
