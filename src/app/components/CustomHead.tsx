// components/CustomHead.tsx

import Head from 'next/head';
import { ReactNode } from 'react';

interface CustomHeadProps {
    children?: ReactNode;
    title: string;
    description: string;
}

const CustomHead = ({ children, title, description }: CustomHeadProps) => {
    return (
        <Head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>{title}</title>
            <meta name="description" content={description} />
            {children}
        </Head>
    );
};

export default CustomHead;
