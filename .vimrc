"-------------------------
" Basic settings
"-------------------------
set nocompatible

" show cursor
set ruler
set showcmd      "show incomplete cmds down the bottom
set showmode     "show current mode down the bottom
" disable line nubmers
set nonu
" folding
set foldmethod=indent
set foldlevel=6

" typing search
set incsearch

" yes.  allow magic patterns in searches
set magic

set hlsearch

set scrolljump=3

set scrolloff=3
set novisualbell
set t_vb=

set mouse=a
set mousemodel=popup

" default codepage
set termencoding=utf-8
set hidden

set guioptions-=T

" cmdline 1 line
set ch=1

" hide mouse on typing
set mousehide

set autoindent
set smartindent

syntax on

" allow to use backspace instead of "x"
set backspace=indent,eol,start whichwrap+=<,>,[,]

" convert tab to spaces
set expandtab

" tab size
set shiftwidth=2
set softtabstop=2
set tabstop=2

"statusline setup
set statusline=%f       "tail of the filename

set statusline+=%=      "left/right separator
set statusline+=%c,     "cursor column
set statusline+=%l/%L   "cursor line/total lines
set statusline+=\ %P    "percent through file
set laststatus=2

" Fix <Enter> for comment
set fo+=cr

" sessions
set sessionoptions=curdir,buffers,tabpages

"-------------------------
" Hot keys
"-------------------------

" When I let Vim write the current buffer I frequently mistype the
" command ":w" as ":W" - so I have to remap it to correct this typo:
nmap :W :w
nmap :Q :q

" go in help
map   \\   <C-]>

" Y = y$ not yy.  More intuative
noremap Y y$
nmap <Space> <PageDown>
imap <C-F> <C-X><C-O>
vmap <C-C> "+yi
imap <C-V> <esc>"+gPi
map <S-Insert> <MiddleMouse>
nmap <C-y> dd
imap <C-y> <esc>ddi
imap <C-d> <esc>yypi
nmap ; :%s/\<<c-r>=expand("<cword>")<cr>\>/

" F1 - Taglist
nmap <F1> :TlistToggle<cr>
vmap <F1> <esc>:TlistToggle<cr>i
imap <F1> <esc>:TlistToggle<cr>i
" F2 - quick save
nmap <F2> :w<cr>
vmap <F2> <esc>:w<cr>i
imap <F2> <esc>:w<cr>i
" F3 - show errors
nmap <F3> :copen<cr>
vmap <F3> <esc>:copen<cr>
imap <F3> <esc>:copen<cr>
" F5 - show buffer list
nmap <F5> <Esc>:BufExplorer<cr>
vmap <F5> <esc>:BufExplorer<cr>
imap <F5> <esc><esc>:BufExplorer<cr>
" F6 - prev buffer
map <F6> :bp<cr>
vmap <F6> <esc>:bp<cr>i
imap <F6> <esc>:bp<cr>i
" F7 - next buffer
map <F7> :bn<cr>
vmap <F7> <esc>:bn<cr>i
imap <F7> <esc>:bn<cr>i
" F9 - "make"
map <F9> :make<cr>
vmap <F9> <esc>:make<cr>i
imap <F9> <esc>:make<cr>i
" F10 - del buffer
map <F10> :bd<cr>
vmap <F10> <esc>:bd<cr>
imap <F10> <esc>:bd<cr>
" F11 - show Taglist
map <F11> :TlistToggle<cr>
vmap <F11> <esc>:TlistToggle<cr>
imap <F11> <esc>:TlistToggle<cr>
" F12 - file explorer
map <F12> :Ex<cr>
vmap <F12> <esc>:Ex<cr>i
imap <F12> <esc>:Ex<cr>i
" < & > - indents
vmap < <gv
vmap > >gv
" disable replace
imap >Ins> <Esc>i

" (koi8-r, cp1251, cp866, utf8)
set wildmenu
set wcm=<Tab>
menu Encoding.koi8-r :e ++enc=koi8-r<CR>
menu Encoding.windows-1251 :e ++enc=cp1251<CR>
menu Encoding.cp866 :e ++enc=cp866<CR>
menu Encoding.utf-8 :e ++enc=utf8 <CR>
" С-q - exit Vim
map <C-Q> <Esc>:qa<cr>

set iminsert=0
set imsearch=0

" tab autocomplete
function InsertTabWrapper()
     let col = col('.') - 1
     if !col || getline('.')[col - 1] !~ '\k'
         return "\<tab>"
     else
         return "\<c-p>"
     endif
endfunction
imap <tab> <c-r>=InsertTabWrapper()<cr>

" words for complete
set complete=""
" buffer
set complete+=.
" dict
set complete+=k
" open bufs
set complete+=b
" tags
set complete+=t

au BufRead,BufNewFile *.phps    set filetype=php
au BufRead,BufNewFile *.thtml    set filetype=php
au BufRead,BufNewFile *.rb		set tabstop=2 shiftwidth=2 expandtab autoindent number smarttab foldmethod=syntax
au BufRead,BufNewFile *.rb		let g:Rubycomplete_rails=1
au BufRead,BufNewFile *.rb		let g:ruby_fold = 1
au BufRead,BufNewFile *.go    set filetype=go

let g:SessionMgr_AutoManage = 0
let g:SessionMgr_DefaultName = "mysession"

" settings for Tlist
let g:Tlist_Show_One_File = 1

set completeopt-=preview
set completeopt+=longest
set mps-=[:]

" set background=dark
" highlight Comment ctermfg=darkgreen
" highlight Comment ctermfg=darkgrey
set ignorecase

autocmd BufRead *.c								imap {<CR> {<CR>}<Esc>O
autocmd BufRead *.c                             set cin

set showmatch

" disable mouse unless gui
if !has('gui_running')
  set mouse=
endif

" codepages & encodings
set ffs=unix,dos,mac
set fencs=utf-8,cp1251,koi8-r,ucs-2,cp866


colorscheme peachpuff
" open NERDTree
"au VimEnter *  NERDTree

" small hint to make snippet to replace current word
nmap ; :%s/\<<c-r>=expand("<cword>")<cr>\>/

map <A-Up>    <C-W>k
map <A-Down>  <C-W>j
map <A-Left>  <C-W>h
map <A-Right> <C-W>l

"allow backspacing over everything in insert mode
set backspace=indent,eol,start

"store lots of :cmdline history
set history=1000


set incsearch   "find the next match as we type the search
set hlsearch    "hilight searches by default

highlight lCursor guifg=NONE guibg=Cyan

set showbreak=...
set wrap linebreak nolist

"mapping for command key to map navigation thru display lines instead
"of just numbered lines
vmap <D-j> gj
vmap <D-k> gk
vmap <D-4> g$
vmap <D-6> g^
vmap <D-0> g^
nmap <D-j> gj
nmap <D-k> gk
nmap <D-4> g$
nmap <D-6> g^
nmap <D-0> g^

"try to make possible to navigate within lines of wrapped lines
nmap <Down> gj
nmap <Up> gk
set fo=l

set formatoptions-=o "dont continue comments when pushing o/O


" Removes trailing spaces
function! TrimWhiteSpace()
  %s/\s\+$//e
endfunction
autocmd BufWritePre     * :call TrimWhiteSpace()

let g:rehash256 = 1
set ttyfast " ?

highlight lCursor guifg=NONE guibg=Cyan

if &term =~ '256color'
	" Disable Background Color Erase (BCE) so that color schemes
	" work properly when Vim is used inside tmux and GNU screen.
	" See also http://snk.tuxfamily.org/log/vim-256color-bce.html
	set t_ut=
endif

if filereadable(expand($HOME . "/.vim/vimrc"))
  source ~/.vim/vimrc
endif

if filereadable(expand($HOME . "/dotfiles/.vimrc.ext"))
 source ~/dotfiles/.vimrc.ext
endif

