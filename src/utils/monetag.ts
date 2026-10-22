import type { MonetagScriptConfig } from '../config/monetag';

const scriptLoads = new Map<string, Promise<void>>();
const SAFE_ATTRIBUTE_NAME = /^(data-[a-z0-9_-]+|crossorigin|referrerpolicy|type)$/i;

function isValidConfiguredScript(config: MonetagScriptConfig): boolean {
  if (!config.id.trim() || !config.src.trim()) return false;

  try {
    const url = new URL(config.src);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
}

/** Loads an explicitly configured HTTPS script once per page. */
export function loadMonetagScript(
  config: MonetagScriptConfig,
  target: HTMLElement = document.head,
): Promise<void> {
  if (!isValidConfiguredScript(config)) {
    return Promise.reject(new Error(`Invalid Monetag script configuration: ${config.id}`));
  }

  const key = `${config.id}:${config.src}`;
  const existingLoad = scriptLoads.get(key);
  if (existingLoad) return existingLoad;

  const existing = document.querySelector<HTMLScriptElement>(
    `script[data-gradeflow-monetag-id="${CSS.escape(config.id)}"]`,
  );
  if (existing) return Promise.resolve();

  const load = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = config.src;
    script.async = config.async ?? true;
    script.defer = config.defer ?? false;
    script.dataset.gradeflowMonetagId = config.id;

    Object.entries(config.attributes ?? {}).forEach(([name, value]) => {
      if (SAFE_ATTRIBUTE_NAME.test(name)) script.setAttribute(name, value);
    });

    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener(
      'error',
      () => {
        scriptLoads.delete(key);
        script.remove();
        reject(new Error(`Monetag script failed to load: ${config.id}`));
      },
      { once: true },
    );

    target.appendChild(script);
  });

  scriptLoads.set(key, load);
  return load;
}
