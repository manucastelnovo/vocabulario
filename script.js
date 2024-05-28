async function transformWord() {
  const newWord = document.getElementById("wordInput").value;
  const apiKey =
    "dict.1.1.20240527T234715Z.28eabf29adf3233c.fff615285d7a6f00f99128aa9547d262971b5115";

  const response = await fetch(
    `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${apiKey}&lang=ru-es&text=${newWord}`
  );
  const data = await response.json();
  const translate = data.def[0];
  function isPlural() {
    const textTranslate = translate.tr[0].text;
    return textTranslate.endsWith("s");
  }

  function isAnimatedObject() {
    if (!translate.anm) {
      return false;
    }
    const textTranslate = translate.anm;
    return textTranslate === "одуш";
  }

  function isMasculine() {
    const textTranslate = translate.gen;
    if (textTranslate === "м") {
      return true;
    } else if (textTranslate === "ср") {
      return null;
    } else {
      return false;
    }
  }

  function changeLastWord() {
    if (isPlural() && !isAnimatedObject()) {
      return newWord;
    } else if (!isPlural() && !isAnimatedObject() && isMasculine()) {
      return newWord;
    } else if (!isPlural() && !isAnimatedObject() && isMasculine() === null) {
      return newWord;
    } else if (isPlural() && isAnimatedObject()) {
      if (newWord.endsWith("ь")) {
        return newWord.slice(0, -1) + "ей";
      } else if (newWord.endsWith("а")) {
        return newWord.slice(0, -1);
      } else {
        return newWord.slice(0, -1) + "ов";
      }
    } else if (!isPlural() && isAnimatedObject() && isMasculine()) {
      if (newWord.endsWith("ь")) {
        return newWord.slice(0, -1) + "я";
      } else {
        return newWord.slice(0, -1) + "а";
      }
    } else if (!isPlural() && isAnimatedObject() && !isMasculine()) {
      if (newWord.endsWith("а")) {
        return newWord.slice(0, -1) + "у";
      } else if (newWord.endsWith("я")) {
        return newWord.slice(0, -1) + "ю";
      } else if (newWord.endsWith("ь")) {
        return newWord;
      }
    } else if (!isPlural() && !isAnimatedObject() && !isMasculine()) {
      if (newWord.endsWith("а")) {
        return newWord.slice(0, -1) + "у";
      } else if (newWord.endsWith("я")) {
        return newWord.slice(0, -1) + "ю";
      } else if (newWord.endsWith("ь")) {
        return newWord;
      }
    }
  }

  const resultWord = changeLastWord();
  const gender = translate.gen;
  const translation = translate.tr[0].text;
  const isAnimated = isAnimatedObject() ? "Animated" : "Inanimate";

  document.getElementById("result").innerHTML = `
            <p>Original word: ${newWord}</p>
            <p>Transformed word: ${resultWord}</p>
            <p>Gender: ${gender}</p>
            <p>Translation: ${translation}</p>
            <p>Animated: ${isAnimated}</p>
        `;
}
