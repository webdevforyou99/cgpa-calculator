export type MonetagScriptLocation = 'head' | 'placement';

export interface MonetagScriptConfig {
  id: string;
  src: string;
  location: MonetagScriptLocation;
  async?: boolean;
  defer?: boolean;
  attributes?: Record<string, string>;
}

export interface MonetagPlacementConfig {
  enabled: boolean;
  minHeight?: number;
  script: MonetagScriptConfig | null;
}

/**
 * Owner-only Monetag configuration.
 *
 * Copy values from the tag issued in your Monetag dashboard. Keep `enabled`
 * false until the site is approved and every script URL/attribute is valid.
 * Do not expose this configuration through visitor-facing forms.
 */
export const monetagConfig = {
  enabled: false,

  // Use for MultiTag, In-Page Push, Vignette, or other tags Monetag says
  // must be placed in <head>. Add one object per unique external script.
  headScripts: [] as MonetagScriptConfig[],

  // Placement scripts are optional and should only be used when the exact
  // Monetag format supports rendering at a chosen location in the document.
  placements: {
    belowHeader: {
      enabled: false,
      minHeight: 0,
      script: null,
    },
    betweenSections: {
      enabled: false,
      minHeight: 0,
      script: null,
    },
    aboveFooter: {
      enabled: false,
      minHeight: 0,
      script: null,
    },
  } satisfies Record<string, MonetagPlacementConfig>,
};
