import styled from "styled-components";

export const HomeCover = styled.div`
  height: 90vh;
`;

// this is the hero section where everything on the homepage will be
export const HeroSection = styled.div`
  height: 75%;
  margin-top: 5%;
  display: flex;
`;

//the hero section is devided into two parts
//this is the left side
export const LeftHero = styled.div`
  height: 100%;
  width: 50%;
`;

//this is the right side
//this is where the big text is on the home screen/page

export const RightHero = styled.div`
  height: 100%;
  width: 50%;
  margin: 2%;

  .upper-text {
    height: 35%;
    width: 100%;
  }

  .middle-text {
    height: 35%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: end;

    div {
      width: 60%;
    }
    p {
      font-family: "Chewy", system-ui;
    }
  }

  .lower-text {
    height: 35%;
    width: 100%;

    h1 {
      font-size: 72px;
    }
  }
`;

//This is the photo container that contains photo on the left hero section
export const LeftSidePhotoContainer = styled.div`
  width: 100%;
  height: 100%;

  //making the image divs stand side to side
  display: flex;

  .left-side-photos {
    width: 50%;
    height: 100%;

    .upper-photos {
      width: 100%;
      height: 30%;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .lower-photos {
      width: 100%;
      height: 100%;

      img {
        width: 50%;
        height: 20%;
        margin-top: 5%;
        margin-left: 50%;
      }
    }
  }

  .right-side-photos {
    width: 50%;
    height: 100%;
    img {
      height: 70%;
      width: 90%;
      margin-left: 5%;
    }
  }
`;
