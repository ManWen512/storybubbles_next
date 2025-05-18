"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchHello } from "@/redux/slices/helloSlice";

export default function Storytwo() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.hello);

  useEffect(() => {
    dispatch(fetchHello()); // Fetch storyOne on mount
  }, [dispatch]);
  console.log(data);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{data}</div>;
}
