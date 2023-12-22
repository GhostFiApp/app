import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, TwitterAuthProvider, UserCredential, Auth, User } from "firebase/auth";
import { auth } from "../../firebase";

interface TwitterAuthContextType {
    user: User | null;
    twitterSignIn: () => Promise<UserCredential>;
    logOut: () => Promise<void>;
}

interface TwitterAuthContextProviderProps {
    children: ReactNode;
}

export const TwitterAuthContext = createContext<TwitterAuthContextType | undefined>(undefined);

export const TwitterAuthContextProvider: React.FC<TwitterAuthContextProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const twitterSignIn = async () => {
        const provider = new TwitterAuthProvider();
        const result = await signInWithPopup(auth, provider);
        setUser(result.user);
        return result;
    };

    const logOut = async () => {
        await signOut(auth);
        setUser(null);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    return (
        <TwitterAuthContext.Provider value={{ user, twitterSignIn, logOut }}>
            {children}
        </TwitterAuthContext.Provider>
    );
};

export const useTwitterAuth = () => {
    const { user } = useContext(TwitterAuthContext) as TwitterAuthContextType;
    const getUserId = () => {
        return user ? user.uid : null;
    };

    return { user, getUserId };
};
