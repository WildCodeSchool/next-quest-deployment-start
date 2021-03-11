import moment from "moment";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import Layout from "../components/Layout";
import { getCampuses } from "../models/campus";

export default function CampusesPage(props) {
  const router = useRouter();
  const { perPage = 5, currentPage = 1 } = router.query;
  const [campuses, setCampuses] = useState(props.campuses);
  const [campusesLoading, setCampusesLoading] = useState(false);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const setCurrentPage = (page) => {
    router.push(`/campuses?currentPage=${page}&perPage=${perPage}`, null, {
      scroll: false
    });
  };

  useEffect(() => {
    setCampusesLoading(true);
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    axios
      .get(
        `/api/campuses?offset=${(currentPage - 1) * perPage}&limit=${perPage}`,
        {
          cancelToken: source.token
        }
      )
      .then((res) => {
        setCampuses(res.data);
        setNumberOfPages(Math.ceil(res.headers["x-total-count"] / perPage));
      })
      .catch(console.error)
      .finally(() => {
        setCampusesLoading(false);
      });

    return () => {
      source.cancel();
    };
  }, [currentPage, perPage]);

  return (
    <Layout pageTitle="Campuses">
      <p>Page generated on : {props.lastUpdateDate}</p>
      <h1>Our Campuses</h1>
      <Link href="/admin/campuses/new">
        <a href="/admin/campuses/new">Add a campus</a>
      </Link>
      <ul style={{ opacity: campusesLoading ? 0.5 : 1 }}>
        {campuses.map(({ id, name }) => {
          return <li key={id}>{name}</li>;
        })}
      </ul>
      <nav>
        {new Array(numberOfPages)
          .fill()
          .map((_, i) => i + 1)
          .map((page) => {
            return (
              <a
                key={page}
                style={{ paddingRight: 10 }}
                href={`/campuses?currentPage=${page}`}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(page);
                }}
              >
                {page}
              </a>
            );
          })}
      </nav>
    </Layout>
  );
}

export async function getStaticProps() {
  const currentDate = moment().format("YYYY-MM-DD - HH:mm:ss");
  const [campuses] = await getCampuses(5, 0);
  return {
    props: {
      campuses,
      lastUpdateDate: currentDate
    },
    revalidate: 10
  };
}
