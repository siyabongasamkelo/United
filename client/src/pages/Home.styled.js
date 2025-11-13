import styled from "styled-components";

export const HomeCover = styled.div`
  height: 100vh;
`;

// this is the hero section where everything on the homepage will be
export const HeroSection = styled.div`
  height: 65%;
  margin-top: 5%;
  display: flex;
  @media only screen and (max-width: 600px) {
    flex-direction: column;
    height: 100%;
  }
`;

//the hero section is devided into two parts
//this is the left side
export const LeftHero = styled.div`
  height: 100%;
  width: 50%;
  @media only screen and (max-width: 600px) {
    width: 100%;
    height: 50%;
  }
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
      /* font-size: 72px; */
      font-size: 5rem;
      color: ${({ theme }) => theme.color.secondary};
    }
  }

  @media only screen and (max-width: 600px) {
    height: 50%;
    width: 100%;
    .middle-text {
      display: none;
    }
    .lower-text {
      height: 50%;
      margin-top: -25%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: start;
      h1 {
        /* font-size: 32px; */
        font-size: 2.5rem;
        text-align: center;
      }
      button {
        height: 30%;
        margin-top: 5%;
      }
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

  @media only screen and (max-width: 600px) {
    margin-top: 15%;
    height: 100%;
    .left-side-photos {
      .upper-photos {
      }
    }
  }
`;

//This is the part that contains social media icons the lowest part
export const SocialMedia = styled.div`
  height: 5%;
  width: 100%;
  margin-top: 7%;

  div {
    width: 13%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    svg {
      /* margin-left: 15px; */
      transform: scale(150%);
    }
  }

  @media only screen and (max-width: 600px) {
    display: none;
  }
`;
