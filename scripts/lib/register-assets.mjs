// Registers asset-hooks.mjs. Use with: node --import ./scripts/lib/register-assets.mjs --import tsx <script>
import { register } from 'node:module';

register('./asset-hooks.mjs', import.meta.url);
