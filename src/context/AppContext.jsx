import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
import { createContext, useState, useEffect, useCallback } from "react";
import { db } from "../config/firebase";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [userData, setUserData] = useState(null);
    const [chatData, setChatData] = useState(null);

    const loadUserData = useCallback(async (uid) => {
        try {
            const userRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userRef);
            const data = userSnap.data();
            setUserData(data);

            await updateDoc(userRef, {
                lastSeen: Date.now()
            });
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        if (userData && userData.id) {
            const userRef = doc(db, 'users', userData.id);
            const intervalId = setInterval(async () => {
                try {
                    await updateDoc(userRef, {
                        lastSeen: Date.now()
                    });
                } catch (error) {
                    console.error("Failed to update lastSeen:", error);
                }
            }, 60000);

            return () => clearInterval(intervalId);
        }
    }, [userData]);

    useEffect(() => {
        if (userData) {
            const chatRef = doc(db, 'chats', userData.id);
            const unSub = onSnapshot(chatRef, async (res) => {
                const chatItems = res.data().chatData;
                const tempData = [];
                for (const item of chatItems) {
                    const userRef = doc(db, 'users', item.rId);
                    const userSnap = await getDoc(userRef);
                    const userData = userSnap.data();
                    tempData.push({
                        ...item, userData
                    });
                }
                setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
            }
            )
            return () => unSub();
        }
    }, [userData]);

    const value = {
        userData, setUserData,
        chatData, setChatData,
        loadUserData
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider

