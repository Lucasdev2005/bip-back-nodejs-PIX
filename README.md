# 🚀 Desafio Técnico Sênior – Backend PIX (Node.js)

# Diagnóstico e Correção sobre Consulta de ISPB

## Diagnóstico

O endpoint `https://www.bcb.gov.br/api/pix/participants`, que vinha sendo utilizado, aparenta não ser mais válido, pois atualmente retorna erro 404. Isso explica os retornos de erro que víamos mesmo para ISPBs válidos. A solução anterior, portanto, não garantia integridade nem confiabilidade das informações.

<img width="1000" height="500" alt="image" src="https://github.com/user-attachments/assets/4c67356d-d999-413d-a230-7ded78e940d6" />


## Correção
Para substituir o endpoint indisponível, optou-se por utilizar o CSV disponível no link [Área das instituições participantes do Pix](https://www.bcb.gov.br/estabilidadefinanceira/pix-participantes), que contém a versão atualizada do dataset.

O arquivo é versionado, ou seja, cada atualização gera um novo CSV com a data correspondente no nome do arquivo, como neste exemplo: [lista de participantes em adesão ao Pix – 09/01/2026](https://www.bcb.gov.br/content/estabilidadefinanceira/participantes_pix/lista-participantes-instituicoes-em-adesao-pix-20260109.csv).

Esse dataset fornece informações completas sobre todos os participantes. Cada instituição possui um ISPB, que a identifica de forma única no sistema de pagamentos do Banco Central.

Com o dataset, é possível:

- Consultar qualquer participante pelo seu ISPB.  
- Garantir **integridade e confiabilidade** das informações.  
- Trabalhar com dados atualizados, considerando que o arquivo possui **TTL de 60 segundos**, sem que sejam excessivamente voláteis.  

Em resumo, a utilização desse dataset oferece uma **fonte oficial, confiável e atualizada** para obtenção de informações sobre participantes e seus ISPBs, substituindo de forma segura o endpoint anteriormente utilizado e eliminando problemas de inconsistência ou falhas de consulta.

<img width="1727" height="1015" alt="image" src="https://github.com/user-attachments/assets/2ee97a98-1e6a-4695-b80c-989db1a6f1a9" />

## Explicação técnica das decisões

O dataset em questão oferece tanto PDF quanto CSV como formatos de exportação. Por questões de baixa complexidade e facilidade de processamento, decidi utilizar apenas o CSV, convertendo seu conteúdo para JSON utilizando a biblioteca csvToJson.

Além disso, para melhorar o controle de atualização e cache das informações, subi uma instância de Redis, que permite definir TTL (tempo de vida) para os dados de forma eficiente. Isso substitui a solução anterior, que utilizava persistência apenas em memória, oferecendo maior confiabilidade e desempenho em consultas frequentes, evitando perda de dados ao reiniciar a aplicação ou estourar limites de memória.

Com essa abordagem, conseguimos:

 - Manter os dados atualizados de forma consistente, considerando o TTL do dataset e do cache;

 - Garantir respostas rápidas para consultas de ISPB e informações dos participantes do STR;

 - Evitar inconsistências ou falhas causadas por armazenamento apenas em memória;

 - Transformar o CSV em JSON de forma simples e utilizável diretamente em aplicações e integrações.

Essa estratégia combina a simplicidade do CSV com a eficiência do Redis, garantindo integridade, confiabilidade e desempenho para consultas a participantes e seus respectivos ISPBs.

## Código limpo e organizado

Para garantir **melhor divisão de responsabilidades** e facilitar o desenvolvimento e manutenção dos testes, utilizei **Dependency Injection (D.I.)** com a biblioteca **Awilix**. Essa abordagem permite uma implementação mais **estruturada, modular e facilmente testável**, com responsabilidades bem definidas entre as diferentes camadas da aplicação.

### Camadas da aplicação

Após a configuração da D.I., a aplicação foi organizada nas seguintes camadas:

- **Core:** Contém funcionalidades centrais da aplicação, como a instância da API, acesso a variáveis de ambiente e o **container Awilix** para injeção de dependências.  
- **Common:** Reúne funcionalidades e recursos **reutilizáveis** em toda a aplicação, como conexão com Redis, constantes globais e utilitários compartilhados.  
- **Features:** Responsável pela modularização das funcionalidades específicas da aplicação. Cada feature pode conter:
  - **Classes utilitárias**  
  - **Services** (lógica de negócio)  
  - **Controllers** (manipulação de requisições)  
  - **Constants**  
  - **Routes** (configuração do Express por módulo)

Essa estrutura facilita a manutenção, o **reuso de código** e a escalabilidade da aplicação.

### Configuração dos testes

Para os testes unitários e de integração, utilizei **Jest** como framework principal.  
- Para compatibilidade e melhor escrita do código, utilizei **Babel** para transpilar para **CommonJS**, que é o padrão esperado pelo Jest.  
- Essa configuração permite utilizar **ES Modules** e recursos modernos do JavaScript sem comprometer a execução dos testes.

### Visibilidade e logs

Para garantir melhor visibilidade e rastreabilidade durante a execução da aplicação, configurei a biblioteca **Winston** para gerenciamento de logs.  
- Isso possibilita **registro estruturado** de mensagens, erros e eventos importantes, facilitando **debug e monitoramento**.

### Documentação da API

Para documentação da API, utilizei a biblioteca **swagger-jsdoc**, que permite gerar documentação **interativa e padronizada** diretamente a partir dos comentários do código.  
- Isso facilita a **consumibilidade da API** por outras equipes e clientes, além de servir como referência para testes e desenvolvimento.


## ▶️ Como executar o projeto

crie um arquivo .env com base no arquivo já existente .env.example e siga os comandos abaixo:

```bash
docker-compose up --build
```

A aplicação ficará disponível em:
```
http://localhost:3000
```

documentação:
```
http://localhost:3000/docs
```

## 🧪 Testando
```bash
npm run test
```
