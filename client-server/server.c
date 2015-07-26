/*
 * www.ATTIRE.ie
 *
 * Command Console Server
*/
 
#include<stdio.h>
#include<string.h>    //strlen
#include<stdlib.h>    //strlen
#include<sys/socket.h>
#include<arpa/inet.h> //inet_addr
#include<unistd.h>    //write
#include<pthread.h> //for threading , link with lpthread
 
char *message , client_message[2000];
volatile int num_clients=0;

//the thread function
void *connection_handler(void *);
 
int main(int argc , char *argv[])
{
    int socket_desc , client_sock , c , *new_sock;
    struct sockaddr_in server , client;
     
    //Create socket
    socket_desc = socket(AF_INET , SOCK_STREAM , 0);
    if (socket_desc == -1)
    {
        printf("Could not create socket");
    }
    puts("Socket created");
     
    //Prepare the sockaddr_in structure
    server.sin_family = AF_INET;
    server.sin_addr.s_addr = INADDR_ANY;
    server.sin_port = htons( 7899 );
     
    //Bind
    if( bind(socket_desc,(struct sockaddr *)&server , sizeof(server)) < 0)
    {
        //print the error message
        perror("bind failed. Error");
        return 1;
    }
    puts("bind done");
     
    //Listen
    listen(socket_desc , 3);
     
    //Accept and incoming connection
    puts("Waiting for incoming connections...");
    c = sizeof(struct sockaddr_in);

    while( (client_sock = accept(socket_desc, (struct sockaddr *)&client, (socklen_t*)&c)) )
    {
        puts("Connection accepted");
         
        pthread_t sniffer_thread;
        new_sock = malloc(1);
        *new_sock = client_sock;
         
        if( pthread_create( &sniffer_thread , NULL ,  connection_handler , (void*) new_sock) < 0)
        {
            perror("could not create thread");
            return 1;
        }
         
        //Now join the thread , so that we dont terminate before the thread
        //pthread_join( sniffer_thread , NULL);
        puts("Handler assigned");
		num_clients++;
    }
     
    if (client_sock < 0)
    {
        perror("accept failed");
        return 1;
    }
     
    return 0;
}
 

handle_client_message()
{
	char buff[256];
	int pat;
	switch (client_message[0])
	{
		case 's':
			// Status
			client_message[0] = 0;
			sprintf(buff,"Server Status\r\n-------------\r\n");
			strcat(client_message,buff);
			sprintf(buff,"Connected Clients: %d\r\n", num_clients);
			strcat(client_message,buff);
			break;
		case 'p':
			// Pattern
			pat = atoi(&client_message[1]);
			printf("pattern %d\n", pat);
			if ((pat <16) && (pat >0)) {
				printf("changing to pattern %d\n", pat);
				sprintf(client_message,"OK\r\n");
			} else if (pat==0){
				printf("client pattern request\n");
				sprintf(client_message,"3\r\n");
			} else {
				printf("invalid pattern\n");
				sprintf(client_message,"ERROR\r\n");
			}
			break;
		case 'h':
			if (!strcmp(client_message,"help")) {
				client_message[0] = 0;
				sprintf(buff,"\nWelcome to the ATTIRE garment command console.\n"); strcat(client_message,buff);
				sprintf(buff,"Each console command is a single letter\n");
				strcat(client_message,buff);
				sprintf(buff,"Certain commands have parameters (spaces not allowed)\n");
				strcat(client_message,buff);
				sprintf(buff,"\nCommands\n--------\n"); strcat(client_message,buff);
				sprintf(buff,"h      - Help\n"); strcat(client_message,buff);
				sprintf(buff,"s      - Status\n"); strcat(client_message,buff);
				sprintf(buff,"p<num> - get/set pattern - e.g. p3\n\n"); strcat(client_message,buff);
			} else {
				sprintf(client_message,"Unknown Command\n");
			}
			break;
		default:
			sprintf(client_message,"Unknown Command\r\n");
			break;
	}
}

/*
 * This will handle connection for each client
 * */
void *connection_handler(void *socket_desc)
{
    //Get the socket descriptor
    int sock = *(int*)socket_desc;
    int read_size;
     
    //Send some messages to the client
     
    //Receive a message from client
	//memset(client_message,0, 2000);
    while( (read_size = recv(sock , client_message , 2000 , 0)) > 0 )
    {
		client_message[read_size] = 0; // terminate string
        //Send the message back to client
		printf("Cient message : [%s]\n", client_message);
		handle_client_message();
        write(sock , client_message , strlen(client_message));
    }
     
    if(read_size == 0)
    {
        puts("Client disconnected");
		num_clients--;
        fflush(stdout);
    }
    else if(read_size == -1)
    {
        perror("recv failed");
    }
         
    //Free the socket pointer
    free(socket_desc);
     
    return 0;
}
