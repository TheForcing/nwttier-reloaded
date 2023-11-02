import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { styled } from "styled-components";

const Button = styled.span`
  margin-top: 50px;
  background-color: white;
  font-weight: 500;
  width: 100%;
  color: black;
  padding: 10px 20px;
  border-radius: 50px;
  border: 0;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Logo = styled.img`
  height: 25px;
`;

export default function GithunButton (){
    const navigate = useNavigate();
    const onClick = async ()=>{
        try{
            const provider = new GithubAuthProvider();
            await signInWithPopup(auth, provider);
            navigate("/");
        } catch(error){
            console.log(error);
        }
    };
    return(
        <Button onClick={onClick}>
             <Logo src="/github-mark.svg"/>
             Continue with github
        </Button>
    )
}