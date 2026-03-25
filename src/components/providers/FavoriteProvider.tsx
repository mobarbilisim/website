"use client";

import { createContext, useContext, useState, useEffect } from "react";

export type FavoriteItem = {
  id: number;
  title: string;
  price: number;
  image_url: string;
};

interface FavoriteContextType {
  favorites: FavoriteItem[];
  addFavorite: (product: any) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  totalFavorites: number;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export function FavoriteProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedFavs = localStorage.getItem("mobar_favorites");
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("mobar_favorites", JSON.stringify(favorites));
    }
  }, [favorites, isMounted]);

  const addFavorite = (product: any) => {
    setFavorites((prev) => {
      if (prev.find((item) => item.id === product.id)) return prev;
      return [...prev, { 
        id: product.id, 
        title: product.title, 
        price: product.price, 
        image_url: product.image_url 
      }];
    });
  };

  const removeFavorite = (id: number) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const isFavorite = (id: number) => {
    return favorites.some((item) => item.id === id);
  };

  const totalFavorites = favorites.length;

  return (
    <FavoriteContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, totalFavorites }}>
      {children}
    </FavoriteContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (context === undefined) throw new Error("useFavorites must be used within a FavoriteProvider");
  return context;
};
