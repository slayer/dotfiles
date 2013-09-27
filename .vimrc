
"-------------------------
" Базовые настройки
"-------------------------

" Включаем несовместимость настроек с Vi (ибо Vi нам и не понадобится).
set nocompatible

" Показывать положение курсора всё время.
set ruler

" Показывать незавершённые команды в статусбаре
set showcmd

" Выключаем нумерацию строк
set nonu

" Фолдинг по отсупам
set foldmethod=indent
set foldlevel=6

" Поиск по набору текста (очень полезная функция)
set incsearch

" yes.  allow magic patterns in searches
set magic

" НЕ Отключаем подстветку найденных вариантов
set hlsearch

" Теперь нет необходимости передвигать курсор к краю экрана, чтобы подняться в режиме редактирования
set scrolljump=3

" Теперь нет необходимости передвигать курсор к краю экрана, чтобы опуститься в режиме редактирования
set scrolloff=3

" Выключаем надоедливый "звонок"
set novisualbell
set t_vb=

" Поддержка мыши
set mouse=a
set mousemodel=popup

" Кодировка текста по умолчанию
set termencoding=utf-8

" Не выгружать буфер, когда переключаемся на другой
" Это позволяет редактировать несколько файлов в один и тот же момент без необходимости сохранения каждый раз
" когда переключаешься между ними
set hidden

" Скрыть панель в gui версии ибо она не нужна
set guioptions-=T

" Сделать строку команд высотой в одну строку
set ch=1

" Скрывать указатель мыши, когда печатаем
set mousehide

" Включить автоотступы
set autoindent

" Влючить подстветку синтаксиса
syntax on

" allow to use backspace instead of "x"
set backspace=indent,eol,start whichwrap+=<,>,[,]

" НЕ Преобразование Таба в пробелы
set noexpandtab

" Размер табулации по умолчанию
set shiftwidth=2
set softtabstop=2
set tabstop=2

" Формат строки состояния
set statusline=%<%f%h%m%r\ %b\ %{fugitive#statusline()}%{&encoding}\ 0x\ \ %l,%c%V\ %P
set laststatus=2

" Включаем "умные" отспупы ( например, автоотступ после {)
set smartindent

" Fix <Enter> for comment
set fo+=cr

" Опции сесссий
set sessionoptions=curdir,buffers,tabpages

"-------------------------
" Горячие клавишы
"-------------------------

" When I let Vim write the current buffer I frequently mistype the
" command ":w" as ":W" - so I have to remap it to correct this typo:
nmap :W :w
nmap :Q :q

" go in help
map   \\   <C-]>

" Y = y$ not yy.  More intuative
noremap Y y$

" Пробел в нормальном режиме перелистывает страницы
nmap <Space> <PageDown>

" CTRL-F для omni completion
imap <C-F> <C-X><C-O>

" C-c and C-v - Copy/Paste в "глобальный клипборд"
vmap <C-C> "+yi
imap <C-V> <esc>"+gPi

" Заставляем shift-insert работать как в Xterm
map <S-Insert> <MiddleMouse>

" C-y - удаление текущей строки
nmap <C-y> dd
imap <C-y> <esc>ddi

" C-d - дублирование текущей строки
imap <C-d> <esc>yypi

" Поиск и замена слова под курсором
nmap ; :%s/\<<c-r>=expand("<cword>")<cr>\>/

" F1 - Taglist
nmap <F1> :TlistToggle<cr>
vmap <F1> <esc>:TlistToggle<cr>i
imap <F1> <esc>:TlistToggle<cr>i
" F2 - быстрое сохранение
nmap <F2> :w<cr>
vmap <F2> <esc>:w<cr>i
imap <F2> <esc>:w<cr>i

" F3 - просмотр ошибок
nmap <F3> :copen<cr>
vmap <F3> <esc>:copen<cr>
imap <F3> <esc>:copen<cr>

" F5 - просмотр списка буферов
nmap <F5> <Esc>:BufExplorer<cr>
vmap <F5> <esc>:BufExplorer<cr>
imap <F5> <esc><esc>:BufExplorer<cr>

" F6 - предыдущий буфер
map <F6> :bp<cr>
vmap <F6> <esc>:bp<cr>i
imap <F6> <esc>:bp<cr>i

" F7 - следующий буфер
map <F7> :bn<cr>
vmap <F7> <esc>:bn<cr>i
imap <F7> <esc>:bn<cr>i

" F8 - список закладок
" DELME map <F8> :MarksBrowser<cr>
" DELME vmap <F8> <esc>:MarksBrowser<cr>
" DELME imap <F8> <esc>:MarksBrowser<cr>

" F9 - "make" команда
map <F9> :make<cr>
vmap <F9> <esc>:make<cr>i
imap <F9> <esc>:make<cr>i

" F10 - удалить буфер
map <F10> :bd<cr>
vmap <F10> <esc>:bd<cr>
imap <F10> <esc>:bd<cr>

" F11 - показать окно Taglist
map <F11> :TlistToggle<cr>
vmap <F11> <esc>:TlistToggle<cr>
imap <F11> <esc>:TlistToggle<cr>

" F12 - обозреватель файлов
map <F12> :Ex<cr>
vmap <F12> <esc>:Ex<cr>i
imap <F12> <esc>:Ex<cr>i

" < & > - делаем отступы для блоков
vmap < <gv
vmap > >gv

" Выключаем ненавистный режим замены
imap >Ins> <Esc>i

" Меню выбора кодировки текста (koi8-r, cp1251, cp866, utf8)
set wildmenu
set wcm=<Tab>
menu Encoding.koi8-r :e ++enc=koi8-r<CR>
menu Encoding.windows-1251 :e ++enc=cp1251<CR>
menu Encoding.cp866 :e ++enc=cp866<CR>
menu Encoding.utf-8 :e ++enc=utf8 <CR>

" Редко когда надо [ без пары =)
"imap [ []<LEFT>
" Аналогично и для {
"imap {<CR> {<CR>}<Esc>O

" С-q - выход из Vim
map <C-Q> <Esc>:qa<cr>

set langmap=ФИСВУАПРШОЛДЬТЩЗЙКЫЕГМЦЧНЯЖ;ABCDEFGHIJKLMNOPQRSTUVWXYZ:,фисвуапршолдьтщзйкыегмцчня;abcdefghijklmnopqrstuvwxyz

set keymap=russian-jcukenwin
set iminsert=0
set imsearch=0
highlight lCursor guifg=NONE guibg=Cyan



" Автозавершение слов по tab =)
function InsertTabWrapper()
     let col = col('.') - 1
     if !col || getline('.')[col - 1] !~ '\k'
         return "\<tab>"
     else
         return "\<c-p>"
     endif
endfunction
imap <tab> <c-r>=InsertTabWrapper()<cr>

" Слова откуда будем завершать
set complete=""
" Из текущего буфера
set complete+=.
" Из словаря
set complete+=k
" Из других открытых буферов
set complete+=b
" из тегов
set complete+=t

" Настройки, специфичные для определынных файлов мы разнесём по разным местам
au BufRead,BufNewFile *.phps    set filetype=php
au BufRead,BufNewFile *.thtml    set filetype=php
au BufRead,BufNewFile *.rb		set tabstop=2 shiftwidth=2 expandtab autoindent number smarttab foldmethod=syntax
au BufRead,BufNewFile *.rb		let g:Rubycomplete_rails=1
au BufRead,BufNewFile *.rb		let g:ruby_fold = 1

" Настройки для SessionMgr
let g:SessionMgr_AutoManage = 0
let g:SessionMgr_DefaultName = "mysession"

" Настройки для Tlist (показвать только текущий файл в окне навигации по  коду)
let g:Tlist_Show_One_File = 1

set completeopt-=preview
set completeopt+=longest
set mps-=[:]

" <Start Vlad settings>
" насильно заставить его считать, что терминал с темным фоном
" set background=dark
" указать цвет комментариев
" highlight Comment ctermfg=darkgreen
" highlight Comment ctermfg=darkgrey
set ignorecase

" q добавление {  }
"autocmd BufRead *.c inoremap { {<CR>}<Esc>O
autocmd BufRead *.c								imap {<CR> {<CR>}<Esc>O
autocmd BufRead *.c                             set cin

"colorscheme torte

" проверка скобок
set showmatch
" <End Vlad settings>

" Отключаем мышь если нету графики
if !has('gui_running')
  set mouse=
endif

" Порядок применения кодировок и формата файлов
set ffs=unix,dos,mac
set fencs=utf-8,cp1251,koi8-r,ucs-2,cp866


if filereadable(expand($HOME . "/.vim/vimrc"))
  source ~/.vim/vimrc
endif

"call pathogen#infect()

if filereadable(expand($HOME . "/.vim/colors/jellybeans.vim"))
  colorscheme jellybeans
endif

" Открыть NERDTree
"au VimEnter *  NERDTree

nmap :Rm :Rmodel
nmap :Rc :Rcontroller
nmap :Rv :Rview
nmap :Rh :Rhelper

" А это маленький хинт, который позволяет по нажатию клавиши ; сконструировать запрос на замену слова под курсором:
nmap ; :%s/\<<c-r>=expand("<cword>")<cr>\>/

map <A-Up>    <C-W>k
map <A-Down>  <C-W>j
map <A-Left>  <C-W>h
map <A-Right> <C-W>l


"allow backspacing over everything in insert mode
set backspace=indent,eol,start

"store lots of :cmdline history
set history=1000

set showcmd     "show incomplete cmds down the bottom
set showmode    "show current mode down the bottom

set incsearch   "find the next match as we type the search
set hlsearch    "hilight searches by default

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

"add some line space for easy reading
set linespace=4

"disable visual bell
set visualbell t_vb=

"try to make possible to navigate within lines of wrapped lines
nmap <Down> gj
nmap <Up> gk
set fo=l

"statusline setup
set statusline=%f       "tail of the filename

"Git
set statusline+=%{fugitive#statusline()}

set statusline+=%=      "left/right separator
set statusline+=%c,     "cursor column
set statusline+=%l/%L   "cursor line/total lines
set statusline+=\ %P    "percent through file
set laststatus=2

"turn off needless toolbar on gvim/mvim
set guioptions-=T
set formatoptions-=o "dont continue comments when pushing o/O


" Removes trailing spaces
function! TrimWhiteSpace()
  %s/\s\+$//e
endfunction
autocmd BufWritePre     * :call TrimWhiteSpace()

"/


filetype off
set rtp+=~/.vim/bundle/vundle/
call vundle#rc()
filetype plugin indent on " обязательно!


Bundle 'L9'
Bundle 'tpope/vim-fugitive'
" Bundle 'lokaltog/vim-easymotion'
" Bundle 'rstacruz/sparkup', {'rtp': 'vim/'}
Bundle 'FuzzyFinder'
Bundle 'rails.vim'
Bundle 'The-NERD-tree'
Bundle 'MatchTag'
Bundle "cucumber.zip"
Bundle "Markdown"
Bundle "ragtag.vim"
Bundle "jQuery"
Bundle 'Syntastic'
Bundle "pangloss/vim-javascript"
" Bundle "vim-haml"
Bundle "vim-coffee-script"
Bundle 'coffee.vim'
Bundle 'less.vim'
Bundle 'endwise.vim'
Bundle 'Tagbar'
nmap <F8> :TagbarToggle<CR>

" Utility
Bundle "repeat.vim"
Bundle "surround.vim"
Bundle "SuperTab"
Bundle "file-line"
Bundle "Align"
Bundle 'ctrlp.vim'
Bundle 'delimitMate.vim'
Bundle 'bling/vim-airline'
	let g:airline_enable_fugitive=1
	let g:airline_enable_syntastic=1
	let g:airline_enable_bufferline=1
  let g:airline_left_sep = '▶'
  let g:airline_right_sep = '◀'

Bundle 'badwolf'
Bundle 'molokai'
Bundle 'railscasts'
Bundle 'twilight256.vim'
Bundle 'jellybeans.vim'
Bundle 'morhetz/gruvbox'
Bundle 'zeis/vim-kolor'
" colorscheme molokai
colorscheme badwolf
" colorscheme railscasts

" tComment
Bundle "tComment"
nnoremap // :TComment<CR>
vnoremap // :TComment<CR>


if has("gui_running")
    "tell the term has 256 colors
    set t_Co=256

    colorscheme railscasts
    set guitablabel=%M%t
    set lines=40
    set columns=115

    if has("gui_gnome")
        set term=gnome-256color
        colorscheme railscasts
        set guifont=Monospace\ 11
    endif

    if has("gui_mac") || has("gui_macvim")
        set guifont=Menlo:h14
        " key binding for Command-T to behave properly
        " uncomment to replace the Mac Command-T key to Command-T plugin
        "macmenu &File.New\ Tab key=<nop>
        "map <D-t> :CommandT<CR>
        " make Mac's Option key behave as the Meta key
    endif

    if has("gui_win32") || has("gui_win32s")
        set guifont=Consolas:h12
        set enc=utf-8
    endif
else
    "dont load csapprox if there is no gui support - silences an annoying warning
    let g:CSApprox_loaded = 1


    "set railscasts colorscheme when running vim in gnome terminal
    if $COLORTERM == 'gnome-terminal'
				set t_Co=256
        set term=gnome-256color
        colorscheme badwolf
    else
        colorscheme badwolf
    endif
endif

set nowrap
set lsp=1 " межстрочный интервал"
if &term =~ '256color'
	" Disable Background Color Erase (BCE) so that color schemes
	" work properly when Vim is used inside tmux and GNU screen.
	" See also http://snk.tuxfamily.org/log/vim-256color-bce.html
	set t_ut=
endif
set ttyfast " ?

