import FlexRow from "./flex_box/FlexRow"
import SelectChain from "./input/SelectChain"
import { Image } from "antd"
import { ChainContext } from "./Context"
import Account from "./layout/Account"
import { useContext } from "react"
import SearchBar from "./input/SearchBar"
import '../styles/Header.module.css'
import Link from "next/link"

const logo = (
    <Link
        href={'/multisigs'}
        style={{
            cursor: 'pointer'
        }}
    >
        <div
            style={{
                position: 'relative',
                margin: 'auto 0'
            }}
        >
            <Image
                src='/images/logo.png'
                height={'50px'}
                preview={false}
            />
        </div>
    </Link>
)

const Header = ({ enableSelectChain }) => {
    const { chain } = useContext(ChainContext)

    return (
        <div
            className="header"
            style={{
                backgroundImage: `${chain.color}`,
                color: '#ffffff',
                padding: '1em 30em',
                position: 'fixed',
                height: '80px',
                width: '100%',
                zIndex: 5
            }}
        >
            <FlexRow
                components={[
                    logo,
                    <FlexRow
                        components={[
                            <SelectChain
                                enableSelectChain={enableSelectChain}
                            />,
                            <Account
                                chainId={chain.chain_id}
                                chainName={chain.name}
                            />
                        ]}
                        justifyContent={'space-between'}
                    />,
                ]}
                justifyContent={'space-between'}
            />
        </div>
    )
}

export default Header