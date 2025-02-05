'user client'
import React from "react"
import{useState,useEffect} from 'react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {Button} from './ui/button'
import {Menu,Coins,Leaf,Search,Bell,User,ChevronDown,LogIn,LogOut} from 'lucide-react'
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger} from '@radix-ui/react-dropdown-menu'
import {Badge} from './ui/badge'
import {Web3Auth} from '@web3auth/modal'

import {CHAIN_NAMESPACES,IProvider,WEB3AUTH_NETWORK} from '@web3auth/base'
import {EthereumPrivateKeyProvider} from '@web3auth/ethereum-provider'
const clientId=process.env.WEB3_AUTH_CLIENT_ID
const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xaa36a7",
    rpcTarget: "https://rpc.ankr.com/eth_sepolia",
    displayName: "Ethereum Sepolia Testnet",
    blockExplorerUrl: "https://sepolia.etherscan.io",
    ticker: "ETH",
    tickerName: "Ethereum",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  };

  const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig },
  });
  
  const web3auth = new Web3Auth({
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.TESTNET, // Changed from SAPPHIRE_MAINNET to TESTNET
    privateKeyProvider,
  });

  interface HeaderProps {
    onMenuClick: () => void;
    totalEarnings: number;
  }

  export default function Header({ onMenuClick, totalEarnings }: HeaderProps) {
    const [provider, setProvider] = useState<IProvider | null>(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState<any>(null);
    const pathname = usePathname()
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const [balance, setBalance] = useState(0)
  
    console.log('user info', userInfo);
    
    useEffect(() => {
      const init = async () => {
        try {
          await web3auth.initModal();
          setProvider(web3auth.provider);
  
          if (web3auth.connected) {
            setLoggedIn(true);
            const user = await web3auth.getUserInfo();
            setUserInfo(user);
            if (user.email) {
              localStorage.setItem('userEmail', user.email);
              try {
                await createUser(user.email, user.name || 'Anonymous User');
              } catch (error) {
                console.error("Error creating user:", error);
                // Handle the error appropriately, maybe show a message to the user
              }
            }
          }
        } catch (error) {
          console.error("Error initializing Web3Auth:", error);
        } finally {
          setLoading(false);
        }
      };
  
      init();
    }, []);

    useEffect(() => {
        const fetchNotifications = async () => {
          if (userInfo && userInfo.email) {
            const user = await getUserByEmail(userInfo.email);
            if (user) {
              const unreadNotifications = await getUnreadNotifications(user.id);
              setNotifications(unreadNotifications);
            }
          }
        };
}