# Web Scraping de Produtos

Este projeto visa realizar scraping de sites estáticos de vendas de produtos. O programa, após realizar o scraping e identificar os produtos, retorna uma tabela dinâmica com as informações extraídas.

## Tecnologias Usadas

### Frontend:
- **React**: Biblioteca JavaScript para criar interfaces de usuário.
- **Vite**: Ferramenta de build que permite um desenvolvimento rápido e otimizado.
- **TypeScript (TSX)**: Superset do JavaScript que adiciona tipagem estática.
- **CSS**: Folhas de estilo para a construção do layout.
- **Socket.IO (cliente)**: Biblioteca para comunicação em tempo real via WebSockets.
- **Toastify**: Biblioteca para exibir notificações de forma elegante.
- **React Icons**: Conjunto de ícones para uso no React.

### Backend:
- **Socket.IO (servidor)**: Para comunicação em tempo real com o frontend via WebSockets.
- **Axios**: Cliente HTTP para realizar requisições e buscar o HTML.
- **Cheerio**: Biblioteca para manipulação e parsing do HTML no backend.
- **Express**: Framework para construir a API.
- **OpenAI API**: Utilizada para tratar e estruturar os dados extraídos.
- **Dotenv**: Para carregar variáveis de ambiente a partir de um arquivo `.env`.
- **Turndown**: Biblioteca para converter HTML em Markdown.

## Fluxo de Execução do Projeto

1. **Frontend**:
   - O usuário solicita o scraping de um site.
   - O frontend envia a requisição para o backend via WebSocket (Socket.IO).
   
2. **Backend**:
   - O backend faz a requisição HTTP do HTML do site utilizando o `axios`.
   - O HTML é limpo e convertido para Markdown usando a biblioteca `turndown`.
   - O Markdown é processado em "chunks" (blocos de texto), cada um representando um produto, usando expressões regulares para identificar padrões de produtos de acordo com o seguinte padrão `[name](/products/slug)`.
   - Cinco chunks são agrupados e enviados para a API da OpenAI, utilizando o modelo GPT-4o, para transformar esses dados em JSON estruturado.
   - O JSON é retornado ao frontend com as informações dos produtos.

3. **Frontend (Continuação)**:
   - O frontend exibe as informações em uma tabela dinâmica.
   - O usuário pode buscar mais dados, o que irá disparar uma nova requisição para o backend, retornando os próximos produtos ou os que existirem, aproveitando o Markdown salvo já processado.

## Como Executar

1. **Instalar Dependências**:
   - No diretório `frontend` e `backend`, instale as dependências do projeto executando o comando:
     ```bash
     npm install
     ```

2. **Rodar o Projeto**:
   - Abra duas instâncias de terminal, uma para o frontend e outra para o backend.
   - Em cada terminal, execute o seguinte comando para rodar o projeto:
     ```bash
     npm run dev
     ```

3. **Configurar a OpenAI API**:
   - Crie uma conta no [OpenAI Playground](https://github.com/marketplace/models/azure-openai/gpt-4o/playground) e gere sua chave API. Você pode obter uma chave gratuita com 50 requisições diárias.
   - No arquivo `.env` da pasta `backend`, insira sua chave da API:
     ```bash
     OPENAI_API_KEY='Your_key'
     ```

## Sites para Teste

Você pode testar o scraping em qualquer um dos seguintes sites:

- [Boll & Branch](https://www.bollandbranch.com/collections/pillows-protectors/?direction=next&cursor=eyJsYXN0X2lkIjo3MzI0NTA2Njg1NDk5LCJsYXN0X3ZhbHVlIjoyMn0%3D)
- [Glossier](https://www.glossier.com/)
- [Carleton Equipment](https://carletonequipment.com/collections/used-equipment)
- [The Sill](https://www.thesill.com/)

## Pontos a Serem Melhorados

1. **Requisições Axios**:
   - A requisição HTTP utilizando o `axios` pode não funcionar em todos os sites, especialmente aqueles que implementam segurança como captchas, validação de IP, login ou pop-ups.
   - **Solução**: Explorar ferramentas pagas ou técnicas mais avançadas para contornar essas verificações.

2. **Limpeza do HTML**:
   - A técnica atual de limpeza do HTML não é eficiente para sites altamente dinâmicos.
   - **Solução**: Explorar estratégias alternativas para limpar classes HTML ou usar ferramentas mais robustas.

3. **Identificação de Produtos**:
   - A identificação de produtos e a formação de chunks não é totalmente eficiente para todos os sites.
   - **Solução**: Realizar uma primeira passagem na API de IA, enviando o Markdown bruto e pedindo uma expressão regular (regex) específica para aquele site, a fim de identificar corretamente os produtos. Após isso, o Markdown pode ser processado de forma mais eficiente.

4. **Posição do Botão de Loading**:
   - O botão de loading pode desaparecer quando a tabela aumenta de tamanho.
   - **Solução**: Ajustar o layout para garantir que o botão de loading permaneça visível durante o processo de carregamento.

## Contribuições

Contribuições são bem-vindas! Caso tenha sugestões, melhorias ou correções, fique à vontade para abrir um *pull request*.

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).
