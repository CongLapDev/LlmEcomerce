import { Row, Col } from "antd";
import globalStyle from "../../../assets/style/base.module.scss";
import style from "./style.module.scss";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import APIBase from "../../../api/ApiBase";
import {
  fetchRootCategoryChildrenSummary,
  getCachedCategoryBarData,
  setCachedCategoryBarData,
} from "../../../api/category";

// Icon mapping for common category names
const getCategoryIcon = (categoryName) => {
  const name = categoryName?.toLowerCase() || "";
  if (name.includes("phone") || name.includes("mobile")) {
    return <i className="fi fi-rr-mobile-button"></i>;
  } else if (name.includes("laptop") || name.includes("notebook")) {
    return <i className="fi fi-rr-laptop"></i>;
  } else if (name.includes("accessory") || name.includes("accessories")) {
    return <i className="fi fi-rr-sparkles"></i>;
  } else if (name.includes("software") || name.includes("app")) {
    return <i className="fi fi-brands-photoshop-camera"></i>;
  } else if (name.includes("speaker") || name.includes("audio")) {
    return <i className="fi fi-rr-speaker"></i>;
  } else if (name.includes("monitor") || name.includes("display")) {
    return <i className="fi fi-rr-desktop-wallpaper"></i>;
  } else if (name.includes("tablet")) {
    return <i className="fi fi-rr-tablet"></i>;
  } else if (name.includes("camera") || name.includes("photo")) {
    return <i className="fi fi-rr-camera"></i>;
  } else if (name.includes("headphone") || name.includes("earphone")) {
    return <i className="fi fi-rr-headphones"></i>;
  } else {
    return <i className="fi fi-rr-folder"></i>; // Default icon
  }
};

// Transform API category data to component format
// Only process first-level categories - do NOT include nested children
const transformCategory = (category) => {
  const transformed = {
    label: category?.name || "Unknown",
    icon: getCategoryIcon(category?.name),
    id: category?.id,
    href: `/product/search?category=${category?.id}`,
  };

  // Don't process children - only display the first level
  // Ignore any nested categories or products

  return transformed;
};

function CategoryBar({ className }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cachedCategories = getCachedCategoryBarData();
    if (Array.isArray(cachedCategories) && cachedCategories.length > 0) {
      setCategories(cachedCategories.map(transformCategory));
      setLoading(false);
      return;
    }

    setLoading(true);

    const loadCategories = async () => {
      try {
        const summary = await fetchRootCategoryChildrenSummary(1);

        if (Array.isArray(summary) && summary.length > 0) {
          setCachedCategoryBarData(summary);
          setCategories(summary.map(transformCategory));
          setLoading(false);
          return;
        }
      } catch (err) {
        // Fallback is handled below for backward compatibility.
      }

      // Fallback for older backend deployments that don't have summary endpoint yet.
      try {
        const rootPayload = await APIBase.get("/api/v1/category/1");
        const rootChildren = rootPayload?.data?.children;
        if (Array.isArray(rootChildren) && rootChildren.length > 0) {
          setCachedCategoryBarData(rootChildren);
          setCategories(rootChildren.map(transformCategory));
          setLoading(false);
          return;
        }

        const payload = await APIBase.get("/api/v1/category");
        const list = Array.isArray(payload?.data) ? payload.data : [];

        // Keep top-level categories only (no parent)
        const topLevel = list.filter(
          (item) =>
            !item?.parent &&
            (item?.parent_id === null || item?.parent_id === undefined),
        );

        const categoriesToDisplay = topLevel.length > 0 ? topLevel : list;
        setCachedCategoryBarData(categoriesToDisplay);
        setCategories(categoriesToDisplay.map(transformCategory));
      } catch (err) {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);
  // Show loading state or empty state
  if (loading) {
    return (
      <Row justify="center" className={clsx(style.container, className)}>
        <Row className={style.category}>
          <Col span={24} style={{ textAlign: "center", padding: "20px" }}>
            <span>Loading categories...</span>
          </Col>
        </Row>
      </Row>
    );
  }

  return (
    <Row justify="center" className={clsx(style.container, className)}>
      <Row className={style.category}>
        {(categories || []).length > 0 ? (
          (categories || []).map((category_) => {
            // Don't render nested children - only display the category itself
            return (
              <Col
                key={category_?.id}
                span={8}
                md={{ span: 6 }}
                lg={{ span: 4 }}
                className={style.category}
              >
                <Link
                  to={category_?.href || "#"}
                  className={clsx(globalStyle.listItem, style.categoryItem)}
                >
                  <span className={globalStyle.icon}>{category_?.icon}</span>
                  <span>{category_?.label || "Unknown"}</span>
                </Link>
              </Col>
            );
          })
        ) : (
          <Col span={24} style={{ textAlign: "center", padding: "20px" }}>
            <span>No categories available</span>
          </Col>
        )}
      </Row>
    </Row>
  );
}

export default CategoryBar;
