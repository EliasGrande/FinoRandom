
SRC = ./FinoRandom.user.js
MIN = ./FinoRandom-min.user.js
UTIL = sh ./greaseutil.sh
COMPRESSOR := $(shell $(UTIL) compressorpath | sed -e 's/ /\\ /g')

.PHONY: all clean cleanutil test install

all: $(MIN)

$(MIN): $(SRC) $(COMPRESSOR)
	$(UTIL) compress $(SRC) > $(MIN)

$(COMPRESSOR):
	$(UTIL) downloadcompressor

test: $(SRC)
	$(UTIL) fireinstall $(SRC)

install: $(MIN)
	$(UTIL) fireinstall $(MIN)

clean:
	rm -f $(MIN)
	find ./ -name "*~" | while read f; do rm -f "$$f"; done

cleanutil:
	$(UTIL) clean
