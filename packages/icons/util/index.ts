import * as icons from "../icons";
import beardedIconsMapping from "../svgs/ext/icons.json";

// Note: beardedIconUrls is not exported from here for React Native compatibility.
// For Vite consumers, use the urls.ts file in svgs/ext/Extras/ directly.

/** The type of a resolved icon asset (string URL in Vite, StaticImageData in Next.js) */
export type IconAsset = (typeof icons)[keyof typeof icons];

// Define a type for icon names. Filters out names with underscores (light/variant suffixes).
export type IconTypes<K = keyof typeof icons> = K extends `${string}_${string}`
	? never
	: K;

// Create a record of icon names that don't contain underscores.
export const iconNames = Object.fromEntries(
	Object.keys(icons)
		.filter((key) => !key.includes("_"))
		.map((key) => [key, key]),
) as Record<IconTypes, string>;

export type IconName = keyof typeof iconNames;

export const getIconByName = (name: IconTypes, isDark?: boolean) => {
	if (!isDark) name = (name + "_Light") as IconTypes;
	return icons[name];
};

/**
 * Gets the appropriate icon based on the given criteria.
 * Returns the icon asset (URL string in Vite, StaticImageData in Next.js).
 */
export const getIcon = (
	kind: string,
	isDark?: boolean,
	extension?: string | null,
	isDir?: boolean,
): IconAsset => {
	if (isDir) return icons[isDark ? "Folder" : "Folder_Light"];

	let document: Extract<keyof typeof icons, "Document" | "Document_Light"> =
		"Document";

	if (extension) extension = `${kind}_${extension.toLowerCase()}`;
	if (!isDark) {
		document = "Document_Light";
		if (extension) extension += "_Light";
	}

	const lightKind = kind + "_Light";

	return icons[
		(extension && extension in icons
			? extension
			: !isDark && lightKind in icons
				? lightKind
				: kind in icons
					? kind
					: document) as keyof typeof icons
	];
};

/**
 * Gets a bearded icon (file extension badge) name for the given extension.
 * Returns the icon name string (e.g., "typescript", "npm") which maps to
 * an SVG file in svgs/ext/Extras/{name}.svg.
 */
export const getBeardedIcon = (
	extension?: string | null,
	fileName?: string | null,
): string | null => {
	if (!extension && !fileName) return null;

	const mapping = beardedIconsMapping as {
		fileExtensions: Record<string, string>;
		fileNames: Record<string, string>;
	};

	if (fileName && mapping.fileNames[fileName.toLowerCase()]) {
		return mapping.fileNames[fileName.toLowerCase()];
	} else if (extension) {
		const ext = extension.toLowerCase().replace(/^\./, "");
		return mapping.fileExtensions[ext] || null;
	}

	return null;
};

/**
 * Gets the 20px variant of an icon if available.
 * Returns null if no 20px variant exists for the given kind.
 */
export const getIcon20 = (kind: string, isDir?: boolean): IconAsset | null => {
	if (isDir) {
		return icons["Folder20" as keyof typeof icons] || null;
	}

	const icon20Key = `${kind}20` as keyof typeof icons;
	return icons[icon20Key] || null;
};
