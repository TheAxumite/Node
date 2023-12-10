section .data
    hello db 'Hello World!', 0Ah ; 'Hello World!' plus a newline character

section .text
    global _start

_start:
    ; Write the string to standard output
    mov eax, 4          ; The system call for sys_write
    mov ebx, 1          ; File descriptor 1 is stdout
    mov ecx, hello      ; The string to write
    mov edx, 13         ; The length of the string
    int 0x80            ; Call kernel

    ; Exit the program
    mov eax, 1          ; The system call for sys_exit
    xor ebx, ebx        ; Return a code of 0
    int 0x80            ; Call kernel
