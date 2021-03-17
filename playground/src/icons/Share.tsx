import React from 'react';

interface ShareProps {
	color?: string;
	size?: number;
}

export const Share = (props: ShareProps): JSX.Element => {
	const { color = '#FFF', size = 30 } = props;
	return (
		<svg
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			x="0px"
			y="0px"
			viewBox="0 0 30 30"
			height={size}
			width={size}
		>
			<path fill={color} d="M24.6,0c-3,0-5.4,2.4-5.4,5.4c0,0.1,0,0.3,0,0.4l-10,4.7C8.2,9.6,6.9,9,5.4,9C2.4,9,0,11.4,0,14.4c0,3,2.4,5.4,5.4,5.4
				c0.9,0,1.8-0.2,2.6-0.7l4.3,3.7c-0.2,0.6-0.3,1.1-0.3,1.8c0,3,2.4,5.4,5.4,5.4c3,0,5.4-2.4,5.4-5.4s-2.4-5.4-5.4-5.4
				c-0.9,0-1.8,0.2-2.6,0.7l-4.3-3.7c0.2-0.6,0.3-1.1,0.3-1.8c0-0.1,0-0.2,0-0.4l10-4.7c1,0.9,2.3,1.5,3.7,1.5c3,0,5.4-2.4,5.4-5.4
				S27.6,0,24.6,0z"/>
		</svg>
	);
};
