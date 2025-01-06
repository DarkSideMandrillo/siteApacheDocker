# Usa l'immagine ufficiale di Apache
FROM httpd:2.4.57

# Copia i file di configurazione personalizzati
COPY ./apache-config/ /usr/local/apache2/conf/

# Copia il contenuto del sito nella directory di Apache
COPY ./src/ /usr/local/apache2/htdocs/

# Crea directory per i log
RUN mkdir -p /usr/local/apache2/logs

# Esponi la porta 80
EXPOSE 80
