import { styled } from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";

const Wrapper = styled.div`
   display: grid;
   grid-template-columns: 3fr 1fr;
   padding: 20px;
   border: 1px solid rgba(255, 255, 255, 0.5);
   border-radius: 15px;
`;

const Column = styled.div`
  
   &: last-child {
    place-self: end;
   }
`;

const Photo = styled.img`
  width:100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
 font-weight: 600;
 font-size: 15px;
`;

const Payload = styled.p`
   margin: 10px 0px;
   font-size: 18px;
`;

const DeleteButton = styled.button`
   background-color: red;
   color: white;
   font-weight: 600;
   border: 0;
   font-size: 12px;
   padding: 5px 10px;
   text-transform: uppercase;
   border-radius: 5px;
   cursor: pointer;
`;

const EditButton = styled.button`
   background-color: green;
   color: white;
   font-weight: 600;
   border: 0;
   font-size: 12px;
   padding: 5px 10px;
   text-transform: uppercase;
   border-radius: 5px;
   cursor: pointer;
   margin-left: 5px;
`;
const Form = styled.form`
 display: flex;
 flex-direction: column;
 gap:10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;
const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;
const AttachFileInput = styled.input`
  display: none;
`;
const ChangeButton = styled.button`
   background-color: white;
   color: black;
   font-weight: 600;
   border: 0;
   font-size: 12px;
   padding: 5px 10px;
   text-transform: uppercase;
   border-radius: 5px;
   cursor: pointer;
   margin-left: 5px;
`;
const CancelButton = styled.button`
   background-color: red;
   color: white;
   font-weight: 600;
   border: 0;
   font-size: 12px;
   padding: 5px 10px;
   text-transform: uppercase;
   border-radius: 5px;
   cursor: pointer;
   margin-left: 5px;
`;

export default function Tweet({ username, photo, tweet, userId, id}: ITweet){
  const [ editmode, setEditmode] = useState(false);
  const [ editTweet, setEditTweet] = useState(tweet);
  const [ editFile, setEditFile] = useState<File | null>(null)
  const [ isLoading, setLoading] = useState(false);
  const [ file, setFile] = useState<File | null>(null);
  const user = auth.currentUser;
  const onDelete = async() => {
    const ok = confirm("이 트윗을 삭제하시겠습니까?");
    if (!ok || user?.uid !== userId)  return;
    try{
      await deleteDoc(doc(db, "tweets", id));
      if (photo){
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch(e){
      console.log(e);
    }finally{
      //
    }
  }; 
  const onEdit = async() => {
    if( user?.uid !== userId)  return;
    setEditmode(true);
  };
  const onChangeTweet = (e: React.ChangeEvent<HTMLTextAreaElement>)=>{
    setEditTweet(e.target.value);
}
const onFileChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
    const {files} =e.target;
    if (files && files.length ===1){
        setEditFile(files[0]);
    }
};
const onChangeTweets = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const user = auth.currentUser;
  if (!user || isLoading || tweet === "" || tweet.length > 180) return;
  try {
    setLoading(true);
    if(tweet){
      await updateDoc(doc(collection(db, "tweets", id)),{
        tweet: tweet,
      })
    }
    if (file) {
      const locationRef = ref(storage, `tweets/${user.uid}/${id}`)
      const result = await uploadBytes(locationRef, file);
      const url = await getDownloadURL(result.ref);
      await updateDoc(doc(collection(db,"tweets", id)), {
        photo: url,
      });
    }
    setEditTweet("");
    setEditFile(null);
  } catch (e) {
    console.log(e);
  } finally {
    setLoading(false);
  }
};
  
const onCancel = () =>{
  setEditmode(false);
  setEditTweet(tweet);
  if(photo){
    setEditFile(file);
  }
};
  
    return (
        <Wrapper>
            
            { editmode === true ?(
              <>
              <Form onSubmit={onChangeTweets} >
              <TextArea
            required
            rows={5}
            maxLength={180}
            onChange={onChangeTweet}
            value={tweet}
            placeholder="글자를 입력하세요"
            />
            <AttachFileButton htmlFor="file">
                {file ? "Photo added  ✅" : "Add photo"}
            </AttachFileButton>
            <AttachFileInput
             onChange={onFileChange}
             type="file"
             id="file"
             accept="image/"
             />
            <ChangeButton type="submit"
             value={isLoading ? "Changing..." : "Change Tweet"}>Change</ChangeButton>
             <CancelButton onClick={onCancel}>Cancel</CancelButton>
        </Form>
              </>
            ):
            <>
            <Column>
             <Username>{username}</Username>
             <Payload>{tweet}</Payload>
             {user?.uid === userId ?(
               <Column>
                <DeleteButton onClick={onDelete}>Delete</DeleteButton>
                <EditButton onClick={onEdit}>Edit</EditButton>
              </Column>
             ): null}
            </Column>
            <Column>
            {photo ?(
                  <Photo src={photo}/>
            ): null}   
            </Column> 
            </>
            }
        </Wrapper>
    );
}