declare module "*.png" {
	const value: any;
	export default value;
}

declare module "*.svg" {
	import type { FC, SVGProps } from "react";
	const ReactComponent: FC<SVGProps<SVGSVGElement>>;
	export { ReactComponent };
	const content: any;
	export default content;
}
