export const D_SUGGESTIONS = Object.freeze({
  situation: [
    "Preciso lidar com uma conversa, tarefa ou decisão que estou adiando.",
    "Algo mudou e ainda não sei qual é o próximo passo.",
  ],
  thought: [
    "Se eu fizer isso, provavelmente vou errar.",
    "Eu deveria conseguir lidar com tudo sem dificuldade.",
  ],
  evidence_for: [
    "O que aconteceu de concreto que parece confirmar esse pensamento?",
    "Qual experiência recente faz essa preocupação parecer possível?",
  ],
  evidence_against: [
    "Que fatos mostram que existe mais de um desfecho possível?",
    "Quando algo parecido aconteceu, o que também deu certo?",
  ],
  alternative_perspective: [
    "Eu diria a um amigo para olhar os fatos e dar um passo de cada vez.",
    "Posso reconhecer a dificuldade sem transformar uma possibilidade em certeza.",
  ],
  response: [
    "Posso fazer o próximo passo possível, mesmo sem me sentir totalmente preparado.",
    "Isso é difícil agora, mas posso lidar com uma parte de cada vez.",
  ],
  steps: [
    "Escrever em uma frase o que precisa ser feito.",
    "Separar cinco minutos para começar sem tentar terminar tudo.",
  ],
  anchor_phrase: [
    "Um passo de cada vez.",
    "Posso agir com cuidado, sem exigir certeza total.",
  ],
});

export const D_SUGGESTION_GUIDE = [
  { title: "Descrever a situação", text: D_SUGGESTIONS.situation[0] },
  { title: "Nomear o pensamento", text: D_SUGGESTIONS.thought[0] },
  { title: "Procurar outro ângulo", text: D_SUGGESTIONS.alternative_perspective[0] },
  { title: "Escolher um próximo passo", text: D_SUGGESTIONS.steps[0] },
];
