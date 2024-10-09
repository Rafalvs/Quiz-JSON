import http.server
import socketserver

PORT = 8000

""" handler processa as solicitacoes recebidas, utilizando o SimpleHTTP... que é uma classe fornecida pela biblioteca importada """
Handler = http.server.SimpleHTTPRequestHandler 

""" faz o servidor rodar na porta selecionada e utiliza o metodo serve_forever() para manter o servidor executando continuamente"""
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("Servidor rodando na porta", PORT)
    httpd.serve_forever()

    # para encerrar
    # npx kill-port 8000 