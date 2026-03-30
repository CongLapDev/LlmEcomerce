import Tippy from "@tippyjs/react/headless";
import style from "./style.module.scss";
import { Col, Button, Skeleton, Empty } from "antd";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import APIBase, { getImageUrl } from "../../../api/ApiBase";
import { debounce } from "lodash";
import { Link, useNavigate } from "react-router-dom";
import PlaceHolder from "../../../assets/image/product_placeholder.png";

function SearchInput() {
  const inputRef = useRef();
  const searchTrigger = useRef();
  const debouncedFetchRef = useRef(null);
  const navigate = useNavigate();
  const [products, setProducts] = useState({
    content: [],
  });
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const fetchProduct = useCallback((name) => {
    if (name.trim()) {
      setLoading(true);
      APIBase.get(`/api/v2/product?name=${encodeURIComponent(name)}`)
        .then((payload) => payload.data)
        .then((data) => {
          setProducts(data || { content: [] });
        })
        .catch(() => {
          setProducts({ content: [] });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    // Initialize debounce only once
    if (!debouncedFetchRef.current) {
      debouncedFetchRef.current = debounce((value) => {
        fetchProduct(value);
      }, 1000);
    }
    // Cleanup debounce on unmount
    return () => {
      if (debouncedFetchRef.current) {
        debouncedFetchRef.current.cancel();
      }
    };
  }, [fetchProduct]);

  const handleInputChange = useCallback((event) => {
    if (debouncedFetchRef.current) {
      debouncedFetchRef.current(event.target.value);
    }
  }, []);

  const handleInputKeyDown = useCallback((event) => {
    if (event.key === "Enter") {
      searchTrigger.current?.click();
    }
  }, []);

  const handleSearchClick = useCallback(() => {
    const value = inputRef.current?.value || "";
    if (value !== "") {
      setVisible(false);
      navigate(`/product/search?name=${value}`);
    }
  }, [navigate]);

  return (
    <Tippy
      interactive
      onClickOutside={() => {
        setVisible(false);
      }}
      visible={visible}
      render={(attr) => (
        <Col
          className={style.searchResult}
          style={{ maxWidth: "460px", width: "90vw" }}
          tabIndex={-1}
          {...attr}
        >
          {loading && <Skeleton />}
          {!loading && products.content.length === 0 && (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
          <div className={style.result}>
            {products.content.map((product_) => (
              <Link
                key={product_.id}
                to={`/product?id=${product_.id}`}
                onClick={() => setVisible(false)}
                className={style.productItem}
              >
                <div className={style.picture}>
                  <img
                    src={getImageUrl(product_.picture) || PlaceHolder}
                    alt={product_.name || "Product"}
                    onError={(e) => {
                      e.currentTarget.src = PlaceHolder;
                    }}
                  />
                </div>
                <div className={style.spec}>
                  <div className={style.name}>{product_.name}</div>
                  <div className={style.manufacturer}>
                    {product_.manufacturer}
                  </div>
                  <div className={style.price}>{product_.min_price}</div>
                </div>
              </Link>
            ))}
            {products.content.length > 0 && (
              <Button
                type="text"
                block
                onClick={() => {
                  searchTrigger.current?.click();
                }}
              >
                Show All
              </Button>
            )}
          </div>
        </Col>
      )}
    >
      <div
        onFocus={() => {
          setVisible(true);
        }}
        tabIndex={0}
        className={style.container}
      >
        <input
          ref={inputRef}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
        />
        <div
          ref={searchTrigger}
          id="searchBtn"
          className={style.icon}
          onClick={handleSearchClick}
        >
          <i className="fi fi-rr-search"></i>
        </div>
      </div>
    </Tippy>
  );
}

export default memo(SearchInput);
