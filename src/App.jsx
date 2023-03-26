import { useState } from "react";
import { Container, Box } from "@chakra-ui/react";
import { Footer, Header, KeywordsModal, TextInput } from "./components";

const App = () => {
  const [keywords, setKeywords] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const extractKeywords = async (text) => {
    setLoading(true);
    setIsOpen(true);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },

      body: JSON.stringify({
        model: "text-davinci-003",
        prompt:
          "Extract keywords from this text. Make the first letter of each word uppercase and seperate with commas:\n\n" +
          text +
          "",
        temperature: 0.5, //0 and 1 (result accuracy)
        max_tokens: 60, //no of words to be returned
        frequency_penalty: 0.8, //repeated words -2.0 to 2.0
      }),
    };

    try {
      const res = await fetch(import.meta.env.VITE_OPENAI_API_URL, options);
      const json = await res.json();
      const data = json.choices[0].text.trim();
      setKeywords(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <Box bg="gray.700" color="white" height="100vh" paddingTop={130}>
      <Container maxW="3xl" centerContent>
        <Header />
        <TextInput extractKeywords={extractKeywords} />
        <Footer />
      </Container>
      <KeywordsModal keywords={keywords} loading={loading} isOpen={isOpen} closeModal={closeModal} />
    </Box>
  );
};

export default App;
