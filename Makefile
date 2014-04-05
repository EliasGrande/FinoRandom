
SRC = ./FinoRandom.user.js
MIN = ./FinoRandom-min.user.js
UTIL = ./greaseutil.sh
COMPRESSOR = ./yuicompressor.jar

$(MIN): $(SRC) $(COMPRESSOR) clean
	$(UTIL) compress $(SRC) > $(MIN)

$(COMPRESSOR):
	$(UTIL) downloadcompressor

clean:
	rm -f $(MIN)
	find ./ -name "*~" | while read f; do rm -f "$$f"; done

test:
	$(UTIL) fireinstall $(SRC)

install: $(MIN)
	$(UTIL) fireinstall $(MIN)
