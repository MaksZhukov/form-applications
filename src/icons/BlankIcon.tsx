import { FC, SVGProps } from 'react';

const BlankIcon: FC<SVGProps<any>> = (props) => (
	<svg
		className={props.className}
        color='gray'
		style={{
			fontSize: props.fontSize,
			width: '1em',
			height: '1em',
			verticalAlign: 'middle',
			fill: 'currentColor',
			overflow: 'hidden'
		}}
		viewBox='0 0 1024 1024'
		version='1.1'
		xmlns='http://www.w3.org/2000/svg'>
		<path d='M642 82H162v860h700V302L642 82z m20 76.6L785.4 282H662V158.6zM822 902H202V122h420v200h200v580z' />
	</svg>
);

export default BlankIcon;
