/*
 * www.ATTIRE.ie
 *
 * Command Console Client
*/
#include<stdio.h> //printf
#include<string.h>    //strlen
#include<sys/socket.h>    //socket
#include<arpa/inet.h> //inet_addr

#define BUFFLEN 2000
 
int main(int argc , char *argv[])
{
    int sock;
	int ret;
    struct sockaddr_in server;
    char message[BUFFLEN] , server_reply[BUFFLEN];
     
    //Create socket
    sock = socket(AF_INET , SOCK_STREAM , 0);
    if (sock == -1)
    {
        printf("Could not create socket");
    }
     
    server.sin_addr.s_addr = inet_addr("127.0.0.1");
    server.sin_family = AF_INET;
    server.sin_port = htons( 7899 );
 
    //Connect to remote server
    if (connect(sock , (struct sockaddr *)&server , sizeof(server)) < 0)
    {
        perror("connect failed. Error");
        return 1;
    }
     
    puts("\nConnected to ATTIRE server");
     
    //keep communicating with server
    while(1)
    {
		//memset(message,0,BUFFLEN);
        printf("attire$ ");
        scanf("%s" , message);
         
        //Send some data
        if( send(sock , message , strlen(message) , 0) < 0)
        {
            puts("Send failed");
            return 1;
        }
         
        //Receive a reply from the server
		memset(server_reply,0,BUFFLEN);
        if( ret = recv(sock , server_reply , BUFFLEN , 0) < 0)
        {
            puts("recv failed");
            break;
        }
         
        printf("%s", server_reply);
    }
     
    close(sock);
    return 0;
}
