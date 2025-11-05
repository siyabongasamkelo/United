import React from "react";
import { HomeCover } from "./Home.styled";
import homeImage from "../assets/img/home.jpeg";

const Home = () => {
  return <HomeCover backgroundImage={homeImage}></HomeCover>;
};

export default Home;
